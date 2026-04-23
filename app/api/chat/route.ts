import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase } from '@/lib/knowledgeBase';
import { generateAnswer } from '@/lib/gemini';
import type { ChatRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Step 1: Search knowledge base for relevant chunks
    const chunks = searchKnowledgeBase(message, 5);

    // Step 2: Generate answer using chunks + Gemini (or mock)
    const response = await generateAnswer(message, chunks, history || []);

    return NextResponse.json(response);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Chat API error:', msg);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.', debug: msg },
      { status: 500 }
    );
  }
}
