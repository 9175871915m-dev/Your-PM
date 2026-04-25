import type { KBChunk, ChatResponse } from './types';

const MODEL = 'gemini-2.0-flash-lite';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function detectSector(text: string): ChatResponse['sector'] {
  const lower = text.toLowerCase();
  if (/\b(electrical|lvdb|cable|wiring|bs7671|transformer|switchgear|amps|volt|earthing)\b/.test(lower)) return 'electrical';
  if (/\b(mechanical|hvac|mep|commissioning|pipework|ductwork|pump|valve|bms|chiller)\b/.test(lower)) return 'mechanical';
  if (/\b(construction|civil|concrete|steel|site|contractor|scaffold|cdm|nec3|fidic|jct)\b/.test(lower)) return 'construction';
  return 'general';
}

export async function generateAnswer(
  query: string,
  chunks: KBChunk[],
  history: { role: string; content: string }[]
): Promise<ChatResponse> {
  const sector = detectSector(query + ' ' + chunks.map(c => c.content).join(' '));

  // Bypass Gemini API entirely and use local knowledge base data
  return generateMockAnswer(query, chunks, sector);
}


function generateMockAnswer(
  query: string,
  chunks: KBChunk[],
  sector: ChatResponse['sector']
): ChatResponse {
  const source = chunks[0];
  const excerpt = source ? source.content.slice(0, 300) : null;

  const frameworkHint =
    sector === 'construction' ? 'NEC3/FIDIC contract clauses and CDM 2015 regulations' :
    sector === 'mechanical'   ? 'CIBSE commissioning guides and BMS integration protocols' :
    sector === 'electrical'   ? 'BS 7671 (IEE Wiring Regulations) and IEC standards' :
    'PMBOK 7th Edition or PRINCE2 principles';

  let answer = `**Based on your local Knowledge Base (${sector} sector):**\n\n`;

  if (source && excerpt) {
    answer += `From **${source.title}**:\n> ${excerpt.trim()}...\n\n`;
  } else {
    answer += `I couldn't find a specific excerpt for that in the local database, but here is general guidance:\n\n`;
  }

  answer += `**Recommended Approach:**\n
1. **Identify Phase** — Determine where in the project lifecycle this issue sits (Initiation → Planning → Execution → Monitoring → Close-out).
2. **Apply Framework** — Apply ${frameworkHint}.
3. **Document & Track** — Raise a formal action item in your risk register or issue log.
4. **Escalate if needed** — If this impacts programme or budget, trigger your change control process.`;

  return {
    answer,
    sources: chunks.map(c => ({
      title: c.title,
      file: c.file,
      sector: c.sector,
      excerpt: c.content.slice(0, 180) + '...',
      score: c.score || 0,
    })),
    sector,
  };
}
