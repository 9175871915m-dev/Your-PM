'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 192;
const FRAME_PATH = '/frames/';
const BATCH_UNLOCK = 48; // Show spinner until this many frames are loaded

function padNum(n: number): string {
  return String(n).padStart(5, '0');
}

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Smooth interpolation state
  const currentFrameFloat = useRef(0);
  const targetFrame = useRef(0);
  const rafId = useRef<number | null>(null);
  const isAnimating = useRef(false);

  // ── Draw a specific integer frame index ──────────────────────────
  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = frames.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    // Seamless background — matches the light grey of the frames
    ctx.fillStyle = '#E8E8E6';
    ctx.fillRect(0, 0, cw, ch);

    // CONTAIN fit — whole frame visible always
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    const scale = Math.min(cw / srcW, ch / srcH);
    const dw = srcW * scale;
    const dh = srcH * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ── rAF render loop with dampen ───────────────────────────────────
  function renderLoop() {
    const diff = targetFrame.current - currentFrameFloat.current;
    if (Math.abs(diff) < 0.05) {
      currentFrameFloat.current = targetFrame.current;
      drawFrame(Math.round(currentFrameFloat.current));
      isAnimating.current = false;
      return;
    }
    currentFrameFloat.current += diff * 0.1;
    drawFrame(Math.round(currentFrameFloat.current));
    rafId.current = requestAnimationFrame(renderLoop);
  }

  function triggerRender() {
    if (!isAnimating.current) {
      isAnimating.current = true;
      rafId.current = requestAnimationFrame(renderLoop);
    }
  }

  // ── Scroll handler ────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section || !loaded) return;
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const fraction = Math.max(0, Math.min(1, scrolled / (sectionH - viewportH)));
      targetFrame.current = fraction * (TOTAL_FRAMES - 1);
      triggerRender();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loaded]);

  // ── Canvas resize ─────────────────────────────────────────────────
  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(Math.round(currentFrameFloat.current));
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // ── Preloader ─────────────────────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    let unlocked = false;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const index = i;

      img.onload = img.onerror = () => {
        if (img.complete && img.naturalWidth > 0) {
          frames.current[index] = img;
        }
        loadedCount++;
        setProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

        // Draw frame 0 as soon as it's ready
        if (index === 0 && img.complete) {
          drawFrame(0);
        }

        if (!unlocked && loadedCount >= BATCH_UNLOCK) {
          unlocked = true;
          setLoaded(true);
        }
      };

      img.src = `${FRAME_PATH}${padNum(i + 1)}.jpg`;
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '500vh',
        background: '#E8E8E6',
      }}
      aria-label="Project management layers animation"
    >
      {/* Sticky canvas viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#E8E8E6',
        }}
      >
        {/* Loading spinner */}
        {!loaded && (
          <div className="hero-loader">
            <div className="hero-spinner" />
            <p className="hero-loader-pct">{progress}%</p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Hero overlay text — fades out as user scrolls */}
        <div className="hero-overlay" style={{ opacity: loaded ? 1 : 0 }}>
          <div className="hero-text-block">
            <p className="hero-eyebrow">AI-Powered PM Advisor</p>
            <h1 className="hero-display">
              Your <em>PM</em>
            </h1>
            <p className="hero-tagline">
              Every project layer — visualised, understood, delivered.
            </p>
            <a href="#chat" className="hero-cta">
              Ask Your PM
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className="hero-scroll-cue">
            <span className="hero-scroll-label">Scroll to explore</span>
            <div className="hero-scroll-line" />
          </div>
        </div>
      </div>
    </div>
  );
}
