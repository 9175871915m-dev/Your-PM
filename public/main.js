// PM GUIDE — HERO CANVAS ENGINE  v3 (createImageBitmap — GPU-resident)
// ─────────────────────────────────────────────────────────────────────
//  Key differences from v2:
//  1. fetch() + createImageBitmap() → JPEG decode happens OFF the JS thread
//  2. ImageBitmap is GPU-resident → drawImage is GPU→GPU, zero CPU scaling
//  3. Pre-scaled to canvas size at decode time → paintFrame = 1 API call
//  4. getContext('2d', {alpha:false}) → skips alpha compositing, ~30% faster
//  5. Concurrent fetch chains (6) → fast load without saturating the network

(function () {
  'use strict';

  /* ── Config ─────────────────────────────── */
  const TOTAL       = 192;
  const PATH        = 'public/frames/';
  const EXT         = '.jpg';
  const GATE        = 32;   // frames before scroll unlocks
  const CONCURRENCY = 6;    // parallel fetch chains
  const BG          = '#E8E8E6';

  /* ── Refs ───────────────────────────────── */
  const hero      = document.getElementById('pm-hero');
  const canvas    = document.getElementById('pm-canvas');
  const loader    = document.getElementById('pm-loader');
  const pctEl     = document.getElementById('pm-loader-pct');
  const textBlock = document.getElementById('pm-text-block');

  if (!canvas || !hero) return;

  // alpha:false = browser skips alpha compositing on every draw — measurably faster
  const ctx = canvas.getContext('2d', { alpha: false });

  // Store ImageBitmap objects (GPU-resident, not HTMLImageElement)
  const bitmaps = new Array(TOTAL).fill(null);

  /* ── State ──────────────────────────────── */
  let loadedN    = 0;
  let unlocked   = false;
  let hasFirst   = false;
  let curF       = 0;
  let tgtF       = 0;
  let rafId      = null;
  let heroTop    = 0;
  let heroH      = 0;
  let winH       = 0;
  let lastFrac   = -1;
  // Pre-computed contain-fit values — recalculated on resize and first bitmap
  let fitX = 0, fitY = 0, fitW = 0, fitH = 0;

  /* ── Canvas sizing ───────────────────────── */
  function resize() {
    heroTop = hero.offsetTop;
    heroH   = hero.offsetHeight;
    winH    = window.innerHeight;
    // Use logical (CSS) pixels — don't multiply by DPR, keeps canvas small
    canvas.width  = window.innerWidth;
    canvas.height = winH;
    // Invalidate cached fit values so next paint recomputes them
    fitW = 0;
    paintFrame(Math.round(curF));
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  /* ── Padding helper ─────────────────────── */
  function pad(n) { return String(n).padStart(5, '0'); }

  /* ── Compute contain-fit (cached) ───────── */
  function computeFit(bmp) {
    const cw = canvas.width, ch = canvas.height;
    const sc = Math.min(cw / bmp.width, ch / bmp.height);
    fitW = Math.round(bmp.width  * sc);
    fitH = Math.round(bmp.height * sc);
    fitX = Math.round((cw - fitW) / 2);
    fitY = Math.round((ch - fitH) / 2);
  }

  /* ── Draw one frame ──────────────────────── */
  function paintFrame(idx) {
    const i = idx < 0 ? 0 : idx >= TOTAL ? TOTAL - 1 : idx;
    const bmp = bitmaps[i];
    if (!bmp) return;

    // Recompute fit if canvas was resized
    if (!fitW) computeFit(bmp);

    // Fill background strips (only if image doesn't cover full canvas)
    ctx.fillStyle = BG;
    if (fitX > 0 || fitY > 0) ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, fitX, fitY, fitW, fitH);
  }

  /* ── Text overlay update (only in rAF) ──── */
  function updateText() {
    if (!textBlock || lastFrac < 0) return;
    const frac    = lastFrac;
    const opacity = frac < 0.12 ? 1 : Math.max(0, 1 - (frac - 0.12) / 0.10);
    textBlock.style.opacity   = opacity;
    textBlock.style.transform = `translateY(${(1 - opacity) * -20}px)`;
  }

  /* ── rAF render loop with damping ───────── */
  function renderLoop() {
    const diff = tgtF - curF;
    if (Math.abs(diff) < 0.06) {
      curF = tgtF;
      paintFrame(Math.round(curF));
      updateText();
      rafId = null;
      return;
    }
    curF += diff * 0.15;    // 0.15 = snappier response, still smooth
    paintFrame(Math.round(curF));
    updateText();
    rafId = requestAnimationFrame(renderLoop);
  }

  function scheduleRender() {
    if (!rafId) rafId = requestAnimationFrame(renderLoop);
  }

  /* ── Scroll handler — data only, no DOM writes ── */
  function onScroll() {
    if (!unlocked) return;
    const raw  = (window.scrollY - heroTop) / (heroH - winH);
    const frac = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    if (Math.abs(frac - lastFrac) < 0.0008) return;
    lastFrac = frac;
    tgtF = frac * (TOTAL - 1);
    scheduleRender();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Loader: fetch → createImageBitmap (JPEG decoded off main thread) ─ */
  let nextIdx = 0;

  function loadNext() {
    if (nextIdx >= TOTAL) return;
    const idx = nextIdx++;
    const url = PATH + pad(idx + 1) + EXT;

    fetch(url)
      .then(function (r) { return r.blob(); })
      .then(function (blob) {
        // Decode at natural resolution — the contain-fit drawImage in paintFrame
        // handles correct letterboxing on all screen shapes (portrait mobile, etc.).
        // Passing canvas dimensions was squashing landscape images on portrait mobile.
        return createImageBitmap(blob);
      })
      .then(function (bmp) {
        bitmaps[idx] = bmp;
        loadedN++;

        // Show frame 0 immediately
        if (!hasFirst && bitmaps[0]) {
          hasFirst = true;
          computeFit(bitmaps[0]);
          paintFrame(0);
        }

        // Progress counter
        if (pctEl) pctEl.textContent = Math.round((loadedN / TOTAL) * 100) + '%';

        // Unlock scroll once enough early frames are ready
        if (!unlocked && loadedN >= GATE) {
          unlocked = true;
          if (loader) {
            loader.classList.add('hidden');
            setTimeout(function () { loader.style.display = 'none'; }, 700);
          }
        }

        loadNext(); // pull next from queue
      })
      .catch(function () {
        loadedN++;
        loadNext(); // skip broken frame, keep loading
      });
  }

  // Kick off CONCURRENCY parallel chains
  var start = Math.min(CONCURRENCY, TOTAL);
  for (var i = 0; i < start; i++) loadNext();

}());


// PM GUIDE — SCROLL ENGINE & INTERACTIVITY

/* ══════════════════════════════════════════════════════════════════
   SCROLL-REVEAL — IntersectionObserver for all .reveal-item elements
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Reveal items on scroll ─────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-item').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ── Animated percentage counter for #pct-counter ───────────── */
  const pctEl = document.getElementById('pct-counter');
  if (pctEl) {
    let started = false;
    const pctObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        let current = 0;
        const target = 80;
        const duration = 1800;
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(eased * target);
          pctEl.textContent = current + '%';
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        pctObserver.disconnect();
      }
    }, { threshold: 0.35 });
    pctObserver.observe(pctEl);
  }

  /* ── Animated bar fills ──────────────────────────────────────── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.ai-bar-fill').forEach((bar) => {
    barObserver.observe(bar);
  });

  /* ── Stagger principle cards on section enter ────────────────── */
  const principlesSection = document.getElementById('s02-principles');
  if (principlesSection) {
    const cardObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.principle-card').forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 55);
        });
        cardObserver.disconnect();
      }
    }, { threshold: 0.10 });

    // Pre-hide all principle cards so we can stagger them in
    document.querySelectorAll('.principle-card').forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    });

    cardObserver.observe(principlesSection);
  }

  /* ── Stagger PESTLE cards ────────────────────────────────────── */
  const pestleSection = document.getElementById('s08-pestle');
  if (pestleSection) {
    const pestleObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.pestle-card').forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
        pestleObserver.disconnect();
      }
    }, { threshold: 0.10 });

    document.querySelectorAll('.pestle-card').forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(28px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });

    pestleObserver.observe(pestleSection);
  }

  /* ── Lifecycle step hover — fill circle on enter ─────────────── */
  document.querySelectorAll('.lf-step').forEach((step) => {
    step.addEventListener('mouseenter', () => {
      step.querySelector('.lf-connector') &&
        (step.querySelector('.lf-connector').style.background = 'var(--accent)');
    });
    step.addEventListener('mouseleave', () => {
      step.querySelector('.lf-connector') &&
        (step.querySelector('.lf-connector').style.background = '');
    });
  });

}());

