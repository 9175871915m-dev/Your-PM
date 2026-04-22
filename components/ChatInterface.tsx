'use client';
import { useState, useRef, useEffect } from 'react';
import type { Message, ChatResponse } from '@/lib/types';
import MessageBubble from './MessageBubble';
import PromptBar from './PromptBar';
import TypingIndicator from './TypingIndicator';

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `**Welcome to Your PM** — your AI project management advisor.

I search through a structured knowledge base to find the most relevant frameworks, standards, and best practices for your question — then synthesise a clear, actionable answer.

**I can help you with:**
- PM frameworks (PMBOK, PRINCE2, Agile)
- The Iron Triangle (Scope, Time, Cost)
- Project Lifecycles (Predictive & Adaptive)
- Risk Management & PESTLE Analysis
- Ethics & Governance
- The future role of AI in PM

**Just type your question or choose a quick prompt below.**`,
  sector: 'general',
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error('API error');

      const data: ChatResponse = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        sector: data.sector,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Something went wrong. Please check your connection and try again.',
        sector: 'general',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-area">
        {messages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <PromptBar onSend={sendMessage} disabled={loading} />
    </div>
  );
}
