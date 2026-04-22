'use client';
import type { Message } from '@/lib/types';

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .split('\n\n')
    .map(p => p.startsWith('<') ? p : `<p>${p}</p>`)
    .join('');
}

const SECTOR_LABELS: Record<string, { label: string; icon: string }> = {
  construction: { label: 'Construction', icon: '🏗️' },
  mechanical:   { label: 'Mechanical',   icon: '⚙️' },
  electrical:   { label: 'Electrical',   icon: '⚡' },
  general:      { label: 'General PM',   icon: '📋' },
};

interface Props { message: Message; }

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const sectorInfo = message.sector ? SECTOR_LABELS[message.sector] : null;

  return (
    <div className={`message-wrap ${message.role}`}>
      {!isUser && sectorInfo && (
        <span className={`sector-tag ${message.sector}`}>
          {sectorInfo.icon} {sectorInfo.label}
        </span>
      )}
      <div className={`message-bubble ${message.role} md-content`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
        )}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="sources-row">
            {message.sources.map((s, i) => (
              <span key={i} className="source-chip" title={s.excerpt}>
                📄 {s.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
