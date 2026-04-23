import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Your PM — AI Project Management Advisor',
  description:
    'AI-powered project management advisor for Construction, Mechanical, and Electrical engineering projects. Get instant guidance on frameworks, risk, contracts, and more.',
  keywords: ['project management', 'construction', 'mechanical', 'electrical', 'MEP', 'PMBOK', 'NEC3', 'FIDIC', 'CDM'],
  openGraph: {
    title: 'Your PM — AI Project Management Advisor',
    description: 'Instant PM guidance for Construction, Mechanical & Electrical projects.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <nav style={{
          position: 'fixed',
          top: '20px',
          left: '24px',
          zIndex: 9999,
          pointerEvents: 'auto',
        }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px 10px 14px',
              borderRadius: '100px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#111111',
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(0,0,0,0.10)',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.90), 0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
              transition: 'background 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7H2.5M6 3.5L2.5 7 6 10.5" stroke="#2A7A8C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Field Guide
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
