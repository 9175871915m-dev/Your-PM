export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  sector?: 'construction' | 'mechanical' | 'electrical' | 'general';
  timestamp: Date;
}

export interface Source {
  title: string;
  file: string;
  sector: string;
  excerpt: string;
  score: number;
}

export interface KBChunk {
  content: string;
  title: string;
  file: string;
  sector: string;
  score?: number;
}

export interface ChatRequest {
  message: string;
  history: { role: string; content: string }[];
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  sector: 'construction' | 'mechanical' | 'electrical' | 'general';
}
