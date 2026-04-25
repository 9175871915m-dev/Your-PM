import type { Metadata } from 'next';
import './globals.css';
import BackButton from '@/components/BackButton';

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
          <BackButton />
        </nav>
        {children}
      </body>
    </html>
  );
}
