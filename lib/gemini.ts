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
  const API_KEY = process.env.GEMINI_API_KEY || '';
  const sector = detectSector(query + ' ' + chunks.map(c => c.content).join(' '));

  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    return generateMockAnswer(query, chunks, sector);
  }

  const contextBlock = chunks.length
    ? `KNOWLEDGE BASE EXCERPTS:\n\n${chunks
        .map((c, i) => `[Source ${i + 1}: ${c.title} (${c.sector})]\n${c.content}`)
        .join('\n\n---\n\n')}`
    : '';

  const systemInstruction = `You are "Your PM", an expert AI project management advisor helping small businesses, charities, and professionals — including those in Construction, Mechanical, and Electrical sectors — in Ireland and beyond.

Provide clear, structured, actionable project management advice.
Reference frameworks (PMBOK, PRINCE2, NEC3, FIDIC, CDM 2015, BS 7671, Agile, Lean) when relevant.
Use **bold** for key terms. Use bullet points and numbered lists. Keep responses focused and practical.
When referencing knowledge base sources, mention them explicitly.
${contextBlock}`;

  const contents = [
    ...history.slice(-4).map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: query }] },
  ];

  const url = `${API_BASE}/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText.slice(0, 300));
      if (response.status === 429) {
        return generateMockAnswer(query, chunks, sector);
      }
      throw new Error(`Gemini API ${response.status}`);
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

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
  } catch (err) {
    console.error('generateAnswer error:', err);
    throw err;
  }
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

  const answer = `**Your PM** has analysed your query across the knowledge base.

${excerpt ? `Based on the **${source!.title}** reference:\n\n> ${excerpt}\n\n` : ''}**Recommended Approach:**

1. **Identify Phase** — Determine where in the project lifecycle this issue sits (Initiation → Planning → Execution → Monitoring → Close-out).
2. **Apply Framework** — Apply ${frameworkHint}.
3. **Document & Track** — Raise a formal action item in your risk register or issue log with owner, due date, and status.
4. **Escalate if needed** — If this impacts programme or budget, trigger your change control process immediately.

> ⚠️ *Demo mode — add your Gemini API key to \`.env.local\` for full AI-powered answers.*`;

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
