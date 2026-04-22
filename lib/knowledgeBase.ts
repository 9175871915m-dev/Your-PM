import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { KBChunk } from './types';

const KB_DIR = path.join(process.cwd(), 'knowledge-base');

function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function splitIntoChunks(text: string, chunkSize = 600): string[] {
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = '';
  for (const para of paragraphs) {
    if ((current + para).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function scoreChunk(chunk: string, query: string): number {
  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);
  const chunkLower = chunk.toLowerCase();
  let score = 0;
  for (const term of queryTerms) {
    const matches = (chunkLower.match(new RegExp(term, 'g')) || []).length;
    score += matches * (1 / Math.log(chunkLower.length + 2));
  }
  return score;
}

function getSector(filePath: string): string {
  const relative = path.relative(KB_DIR, filePath);
  const parts = relative.split(path.sep);
  return parts[0] || 'general';
}

export function searchKnowledgeBase(query: string, topK = 5): KBChunk[] {
  const files = getAllMarkdownFiles(KB_DIR);
  const allChunks: KBChunk[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const { data, content } = matter(raw);
      const sector = getSector(file);
      const title = data.title || path.basename(file, '.md').replace(/_/g, ' ');
      const chunks = splitIntoChunks(content);
      for (const chunk of chunks) {
        const score = scoreChunk(chunk, query);
        allChunks.push({
          content: chunk,
          title,
          file: path.relative(process.cwd(), file),
          sector,
          score,
        });
      }
    } catch {
      // skip unreadable files
    }
  }

  return allChunks
    .filter(c => c.score! > 0)
    .sort((a, b) => b.score! - a.score!)
    .slice(0, topK);
}
