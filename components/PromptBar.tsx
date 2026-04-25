'use client';
import { useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  'How does CDM 2015 apply to construction?',
  'What is a Variation Order?',
  'Explain MEP commissioning',
  'What are the rules under BS 7671?',
  'How is risk managed in construction?',
  'Explain the PMBOK Guide',
];

export default function PromptBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Quick prompt chips */}
      <div className="quick-prompts">
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            className="quick-chip"
            onClick={() => { onSend(p); }}
            disabled={disabled}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Glass prompt bar */}
      <div className="prompt-bar-wrap">
        <div className={`prompt-bar ${focused ? 'focused' : ''}`}>
          <span className="prompt-icon">
            <Sparkles size={20} />
          </span>
          <input
            ref={inputRef}
            className="prompt-input"
            placeholder="Ask Your PM anything — frameworks, lifecycle, risk, governance…"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            id="pm-prompt-input"
            autoComplete="off"
          />
          <button
            className={`send-btn ${disabled ? 'loading' : ''}`}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            aria-label="Send message"
            id="pm-send-btn"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="prompt-shimmer" />
      </div>
    </div>
  );
}
