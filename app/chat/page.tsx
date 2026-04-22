import BackgroundScene from '@/components/BackgroundScene';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <>
      <BackgroundScene />
      <div className="app-wrapper">
        {/* Hero */}
        <section className="hero">
          <div className="logo-badge">
            <span className="logo-dot" />
            AI-Powered PM Advisor
          </div>
          <h1 className="hero-title">
            <span className="hero-glass-pill">
              <span className="gradient-text">Your PM</span>
            </span>
          </h1>
          <p className="hero-subtitle">
            Instant project management guidance. Powered by your knowledge base.
          </p>
        </section>

        {/* Chat */}
        <main id="chat">
          <ChatInterface />
        </main>
      </div>
    </>
  );
}
