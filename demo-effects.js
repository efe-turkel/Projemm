/**
 * DEMO EFFECTS LAYER — yalnızca index-demo.html tarafından yüklenir.
 * Orijinal script.js / index.html dosyalarını değiştirmez; üstüne ek davranış katar:
 *  - Kademeli (stagger) reveal ve reveal sonrası gecikme temizliği
 *  - Scroll'a bağlı bölüm çıkış efekti + parallax
 *  - Glass-panel fare ışığı (spotlight) ve manyetik butonlar
 *  - Sağ kenar bölüm noktaları (scroll-spy)
 *  - Efektleri anında aç/kapat rozeti (orijinalle karşılaştırma)
 */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const fxEnabled = () => root.classList.contains('fx-on');

  document.addEventListener('DOMContentLoaded', () => {
    setupIntroCleanup();
    setupStagger();
    setupSettleObserver();
    setupSpotlight();
    if (finePointer && !reduceMotion) setupMagnetic();
    const dots = setupDots();
    setupScrollEffects(dots);
    // Aç/kapat rozeti yalnızca demo sayfasında gösterilir
    if (/index-demo/.test(location.pathname)) setupBadge();
  });

  /* ---------------- Intro perdesini DOM'dan kaldır ---------------- */
  function setupIntroCleanup() {
    const intro = document.getElementById('fx-intro');
    if (intro) setTimeout(() => intro.remove(), 3800);
  }

  /* ---------------- Kademeli gecikme indeksleri ---------------- */
  function setupStagger() {
    const REVEAL = '.reveal, .reveal-left, .reveal-right, .reveal-zoom';
    const groups = [
      '.hero-content', '.stats-grid', '.skills-grid', '.projects-grid',
      '.about-highlights', '.about-info-grid', '.timeline-wrapper',
      '.contact-info-panel', '.cv-features-list'
    ];

    groups.forEach(sel => {
      document.querySelectorAll(sel).forEach(group => {
        let i = 0;
        Array.from(group.children).forEach(child => {
          if (child.matches(REVEAL)) {
            child.style.setProperty('--i', String(i % 6));
            i++;
          }
        });
      });
    });
  }

  /* ---------------- Reveal bitince transition-delay'i sıfırla ---------------- */
  function setupSettleObserver() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

    const settle = el => {
      if (el.dataset.fxSettling) return;
      el.dataset.fxSettling = '1';
      const inHero = !!el.closest('.hero-section');
      setTimeout(() => el.classList.add('fx-settled'), inHero ? 4800 : 2200);
    };

    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.target.classList.contains('active')) settle(m.target);
      });
    });

    els.forEach(el => {
      if (el.classList.contains('active')) settle(el);
      mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ---------------- Glass panel fare ışığı ---------------- */
  function setupSpotlight() {
    document.querySelectorAll('.glass-panel').forEach(panel => {
      if (panel.classList.contains('modal-dialog')) return;
      if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';
      const spot = document.createElement('span');
      spot.className = 'fx-spot';
      spot.setAttribute('aria-hidden', 'true');
      panel.appendChild(spot);
    });

    if (!finePointer) return;
    let raf = 0;
    document.addEventListener('pointermove', e => {
      if (!fxEnabled() || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const panel = e.target.closest && e.target.closest('.glass-panel');
        if (!panel) return;
        const r = panel.getBoundingClientRect();
        panel.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        panel.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }, { passive: true });
  }

  /* ---------------- Manyetik butonlar ---------------- */
  function setupMagnetic() {
    const targets = document.querySelectorAll('.btn, .icon-btn, .lang-switch-btn, .back-to-top-btn');
    targets.forEach(el => {
      el.addEventListener('pointermove', e => {
        if (!fxEnabled()) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.translate = (dx * 10).toFixed(1) + 'px ' + (dy * 8).toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  /* ---------------- Sağ kenar bölüm noktaları ---------------- */
  function setupDots() {
    const ids = ['hero', 'about', 'skills', 'experience', 'projects', 'cv-section', 'contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const wrap = document.createElement('nav');
    wrap.className = 'fx-dots';
    wrap.setAttribute('aria-label', 'Bölüm gezintisi');

    const labelFor = id => {
      const link = document.querySelector('#nav-links a[href="#' + id + '"]');
      if (link) return link.textContent.trim();
      return root.lang === 'en' ? 'Resume' : 'Özgeçmiş';
    };

    const dots = sections.map(sec => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fx-dot';
      b.setAttribute('aria-label', labelFor(sec.id));
      b.dataset.label = labelFor(sec.id);
      b.addEventListener('mouseenter', () => { b.dataset.label = labelFor(sec.id); });
      b.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      wrap.appendChild(b);
      return { el: b, sec };
    });

    document.body.appendChild(wrap);
    setTimeout(() => wrap.classList.add('fx-visible'), 3600);
    return dots;
  }

  /* ---------------- Scroll'a bağlı efektler (tek rAF döngüsü) ---------------- */
  function setupScrollEffects(dots) {
    const sections = Array.from(document.querySelectorAll('main > section'));
    const auroras = Array.from(document.querySelectorAll('.aurora-glow'));
    const heroVisual = document.querySelector('.hero-visual');
    const auroraSpeed = [0.10, 0.18, 0.06];
    let ticking = false;
    let wasOn = true;

    function resetInline() {
      sections.forEach(s => s.style.removeProperty('--exit'));
      auroras.forEach(a => { a.style.translate = ''; });
      if (heroVisual) heroVisual.style.translate = '';
    }

    function update() {
      ticking = false;
      const on = fxEnabled();
      if (!on) {
        if (wasOn) resetInline();
        wasOn = false;
        return;
      }
      wasOn = true;

      const vh = window.innerHeight;
      const y = window.scrollY;

      // Bölüm çıkış ilerlemesi
      if (!reduceMotion) {
        sections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          const start = vh * 0.6;
          const exit = clamp((start - r.bottom) / start, 0, 1);
          sec.style.setProperty('--exit', exit.toFixed(3));
        });

        // Parallax
        auroras.forEach((a, i) => {
          a.style.translate = '0 ' + (-y * (auroraSpeed[i] || 0.08)).toFixed(1) + 'px';
        });
        if (heroVisual) {
          const p = clamp(y, 0, vh * 1.2);
          heroVisual.style.translate = '0 ' + (-p * 0.08).toFixed(1) + 'px';
        }
      }

      // Aktif nokta (scroll-spy)
      let activeIdx = 0;
      dots.forEach((d, i) => {
        const r = d.sec.getBoundingClientRect();
        if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) activeIdx = i;
      });
      dots.forEach((d, i) => d.el.classList.toggle('active', i === activeIdx));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('fx-toggle', onScroll);
    update();
  }

  /* ---------------- Demo rozeti: efektleri aç/kapat ---------------- */
  function setupBadge() {
    const badge = document.createElement('div');
    badge.className = 'fx-badge';
    badge.innerHTML =
      '<span class="fx-badge-dot"></span>' +
      '<span class="fx-badge-text"></span>' +
      '<button type="button"></button>';
    document.body.appendChild(badge);

    const text = badge.querySelector('.fx-badge-text');
    const btn = badge.querySelector('button');

    function render() {
      const on = fxEnabled();
      text.textContent = on ? 'DEMO: Animasyonlar AÇIK' : 'ORİJİNAL görünüm';
      btn.textContent = on ? 'Orijinali gör' : 'Demoyu gör';
    }

    btn.addEventListener('click', () => {
      const turningOn = !fxEnabled();
      root.classList.toggle('fx-on', turningOn);
      localStorage.setItem('efe_fx', turningOn ? 'on' : 'off');
      render();
      document.dispatchEvent(new Event('fx-toggle'));
    });

    render();
  }
})();

