/**
 * EFE.DEV - PORTFOLIO & INTERACTIVE RESUME APPLICATION LOGIC
 * High-performance vanilla JavaScript with interactive canvas physics,
 * sound synthesis, smooth scroll observers, 3D tilt, and dynamic filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initSoundEffects();
  initTheme();
  initLanguage();
  initCanvasBackground();
  initScrollProgress();
  initNavbar();
  initTypewriter();
  initTiltEffect();
  initCounters();
  initFilterTabs();
  initTimelineSwitcher();
  initModals();
  initContactForm();
  initScrollReveal();
});

/* ===================================================================
   1. BACKGROUND MUSIC PLAYER (Eminem - Lose Yourself, Verse 1)
   =================================================================== */
let bgMusic = null;
let musicPlaying = false;

function initSoundEffects() {
  initMusicPlayer();
}

function initMusicPlayer() {
  bgMusic = document.getElementById('bg-music');
  const soundToggleBtn = document.getElementById('sound-toggle');

  if (bgMusic) {
    bgMusic.volume = 0.55; // Dengeli ve net ses seviyesi

    bgMusic.addEventListener('play', () => {
      musicPlaying = true;
      updateMusicUI();
    });

    bgMusic.addEventListener('pause', () => {
      musicPlaying = false;
      updateMusicUI();
    });

    bgMusic.addEventListener('ended', () => {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => { });
    });
  }

  // Önceki tercih kontrolü
  const savedMusic = localStorage.getItem('efe_music_enabled');
  if (savedMusic === 'true') {
    const resumeOnGesture = () => {
      if (bgMusic && bgMusic.paused && localStorage.getItem('efe_music_enabled') === 'true') {
        bgMusic.play().then(() => {
          musicPlaying = true;
          updateMusicUI();
        }).catch(() => { });
      }
      window.removeEventListener('pointerdown', resumeOnGesture);
      window.removeEventListener('keydown', resumeOnGesture);
    };
    window.addEventListener('pointerdown', resumeOnGesture, { once: true });
    window.addEventListener('keydown', resumeOnGesture, { once: true });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', toggleMusic);
  }

  updateMusicUI();
}

function toggleMusic() {
  if (!bgMusic) {
    bgMusic = document.getElementById('bg-music');
  }
  if (!bgMusic) return;

  const t = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : null;

  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      localStorage.setItem('efe_music_enabled', 'true');
      updateMusicUI();
      showToast(t?.toastMusicPlaying || '🎵 Çalıyor: Eminem - Lose Yourself', 'info');
    }).catch(err => {
      console.warn('Playback error:', err);
      showToast(t?.toastMusicPrompt || 'Müziği başlatmak için lütfen tıklayın', 'warning');
    });
  } else {
    bgMusic.pause();
    musicPlaying = false;
    localStorage.setItem('efe_music_enabled', 'false');
    updateMusicUI();
    showToast(t?.toastMusicPaused || 'Müzik duraklatıldı 🔇', 'info');
  }
}

function updateMusicUI() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (!soundToggleBtn) return;
  const icon = soundToggleBtn.querySelector('i');
  const t = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : null;

  if (musicPlaying) {
    if (icon) icon.className = 'fa-solid fa-volume-high';
    soundToggleBtn.classList.add('is-playing');
    soundToggleBtn.setAttribute('title', t?.soundTitlePause || 'Müziği Durdur (Eminem - Lose Yourself)');
    soundToggleBtn.setAttribute('aria-label', t?.soundTitlePause || 'Müziği Durdur');
  } else {
    if (icon) icon.className = 'fa-solid fa-volume-xmark';
    soundToggleBtn.classList.remove('is-playing');
    soundToggleBtn.setAttribute('title', t?.soundTitlePlay || 'Müziği Çal (Eminem - Lose Yourself)');
    soundToggleBtn.setAttribute('aria-label', t?.soundTitlePlay || 'Müziği Çal');
  }
}

// Geriye dönük uyumluluk: diğer tıklama olaylarındaki playSound çağrıları hata üretmesin
function playSound(type) {
  // Eminem Lose Yourself arka plan müziği devrede
}

/* ===================================================================
   2. THEME CONTROLLER (Dark / Light Mode)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('efe_theme');
  const currentTheme = storedTheme === 'light' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('efe_theme', newTheme);
      updateThemeIcon(newTheme);
      playSound('toggle');
      const t = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : null;
      const themeToast = newTheme === 'dark'
        ? (t?.toastThemeDark || 'Karanlık tema etkinleştirildi 🌙')
        : (t?.toastThemeLight || 'Aydınlık tema etkinleştirildi ☀️');
      showToast(themeToast, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  const icon = themeToggleBtn.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

/* ===================================================================
   2.1 MULTI-LANGUAGE SYSTEM (TR / EN)
   =================================================================== */
const ALLOWED_LANGS = ['tr', 'en'];
let currentLang = ALLOWED_LANGS.includes(localStorage.getItem('efe_lang'))
  ? localStorage.getItem('efe_lang')
  : 'tr';

function initLanguage() {
  const langToggleBtn = document.getElementById('lang-toggle');
  const mobileLangToggleBtn = document.getElementById('mobile-lang-toggle');

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'tr' ? 'en' : 'tr';
      setLanguage(newLang, true);
    });
  }

  if (mobileLangToggleBtn) {
    mobileLangToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'tr' ? 'en' : 'tr';
      setLanguage(newLang, true);
    });
  }

  setLanguage(currentLang, false);
}

function setLanguage(lang, showNotification = false) {
  if (typeof translations === 'undefined' || !translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('efe_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('data-fx-lang', lang);

  // Update navbar indicator
  const optTr = document.getElementById('lang-opt-tr');
  const optEn = document.getElementById('lang-opt-en');
  if (optTr && optEn) {
    if (lang === 'tr') {
      optTr.classList.add('active');
      optEn.classList.remove('active');
    } else {
      optTr.classList.remove('active');
      optEn.classList.add('active');
    }
  }

  // Update mobile drawer toggle label
  const mobileLangLabel = document.getElementById('mobile-lang-label');
  if (mobileLangLabel) {
    mobileLangLabel.textContent = lang === 'tr' ? 'Switch to English (EN)' : "Türkçe'ye Geç (TR)";
  }

  // Update document title
  if (translations[lang].pageTitle) {
    document.title = translations[lang].pageTitle;
  }

  // Update sound toggle button title/label
  updateMusicUI();

  // Translate all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (val !== undefined) {
      if (val.includes('<') && val.includes('>')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Translate data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = translations[lang][key];
    if (val !== undefined) {
      el.placeholder = val;
    }
  });

  // Translate data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = translations[lang][key];
    if (val !== undefined) {
      el.title = val;
    }
  });

  // Translate data-i18n-aria
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const val = translations[lang][key];
    if (val !== undefined) {
      el.setAttribute('aria-label', val);
    }
  });

  // Restart typewriter with localized roles
  initTypewriter();

  // If a project modal is open, re-render it
  const projectModal = document.getElementById('project-modal');
  if (projectModal && projectModal.classList.contains('open') && window._currentProjectId && typeof window.openProjectModal === 'function') {
    window.openProjectModal(window._currentProjectId);
  }

  if (typeof window._refreshFxDots === 'function') window._refreshFxDots();

  if (showNotification) {
    playSound('click');
    showToast(translations[lang].toastLangChanged || 'Language changed', 'info');
  }
}

/* ===================================================================
   3. DYNAMIC INTERACTIVE PARTICLES & CONSTELLATION CANVAS
   =================================================================== */
/* ===================================================================
   3. FULL-PAGE DATA ANALYTICS & FINANCIAL RISK VISUAL ENGINE
   =================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Analytical Mouse HUD State
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };
  const mouseRadiusSq = mouse.radius * mouse.radius;

  // Expanding shockwave ripples on click
  const ripples = [];

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('click', (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: Math.min(width, height) * 0.28,
      alpha: 0.75
    });
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDataStreamFormulas();
    }, 150);
  }, { passive: true });

  // -------------------------------------------------------------
  // A. Scatter & Cluster Data Nodes (Graph Network)
  // -------------------------------------------------------------
  const nodes = [];
  const nodeCount = Math.min(Math.max(Math.floor((width * height) / 32000), 32), 52);
  const maxDistance = 135;
  const maxDistSq = maxDistance * maxDistance;

  class DataNode {
    constructor(id) {
      this.id = id;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.isHub = id % 7 === 0; // Cluster centroid / hub node
      this.baseRadius = this.isHub ? 3.8 : Math.random() * 1.5 + 1.8;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.04;

      if (this.x < 15 || this.x > width - 15) this.vx = -this.vx;
      if (this.y < 15 || this.y > height - 15) this.vy = -this.vy;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouseRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
        }
      }
    }

    draw(isDark) {
      const pulseSize = this.isHub ? Math.sin(this.pulse) * 1.2 : 0;
      const currentRadius = this.baseRadius + pulseSize;

      // Hub outer pulse ring & Cluster tag
      if (this.isHub) {
        const ringAlpha = (Math.sin(this.pulse) + 1) * 0.22;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? `rgba(0, 242, 254, ${ringAlpha})` : `rgba(2, 132, 199, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '9px monospace';
        ctx.fillStyle = isDark ? `rgba(0, 242, 254, ${ringAlpha * 2.5})` : `rgba(2, 132, 199, ${ringAlpha * 2.5})`;
        ctx.fillText(`CLUSTER [ID:${this.id}]`, this.x + 12, this.y + 3);
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.isHub
        ? (isDark ? 'rgba(0, 242, 254, 0.95)' : 'rgba(2, 132, 199, 0.95)')
        : (isDark ? 'rgba(157, 78, 221, 0.75)' : 'rgba(124, 58, 237, 0.75)');
      ctx.fill();
    }
  }

  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new DataNode(i));
  }

  // -------------------------------------------------------------
  // B. Traveling Data Packets (Photon pulses along graph edges)
  // -------------------------------------------------------------
  const packets = [];
  const packetCount = 14;

  class DataPacket {
    constructor() {
      this.reset();
    }

    reset() {
      this.fromNode = nodes[Math.floor(Math.random() * nodes.length)];
      this.toNode = null;
      this.progress = 0;
      this.speed = Math.random() * 0.015 + 0.008;

      // Find a neighbor node within connection distance
      const neighbors = nodes.filter(n => {
        if (n === this.fromNode) return false;
        const dx = n.x - this.fromNode.x;
        const dy = n.y - this.fromNode.y;
        return (dx * dx + dy * dy) < maxDistSq;
      });

      if (neighbors.length > 0) {
        this.toNode = neighbors[Math.floor(Math.random() * neighbors.length)];
      } else {
        this.fromNode = nodes[Math.floor(Math.random() * nodes.length)];
      }
    }

    update() {
      if (!this.toNode) {
        this.reset();
        return;
      }

      this.progress += this.speed;
      if (this.progress >= 1) {
        this.reset();
      }
    }

    draw(isDark) {
      if (!this.toNode) return;
      const curX = this.fromNode.x + (this.toNode.x - this.fromNode.x) * this.progress;
      const curY = this.fromNode.y + (this.toNode.y - this.fromNode.y) * this.progress;

      ctx.beginPath();
      ctx.arc(curX, curY, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#00f2fe' : '#0284c7';
      ctx.shadowColor = isDark ? '#00f2fe' : '#0284c7';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < packetCount; i++) {
    packets.push(new DataPacket());
  }

  // -------------------------------------------------------------
  // C. Floating Live Data Science & Financial Risk Formula Chips
  // -------------------------------------------------------------
  const formulasData = [
    'R² = 0.984',
    'ROC-AUC: 0.942',
    'SELECT * FROM risk_portfolio',
    'f(x) = σ(Wᵀx + b)',
    'NPL Ratio: 1.84%',
    'p-value < 0.001',
    'Σ(xᵢ - μ)² / N',
    'df.groupby("segment").agg()',
    'VaR (99% Conf: -1.4%)',
    'Gaussian N(μ, σ²)',
    'Loss: 0.0162 ↓',
    'K-Means (k=3 Optimal)',
    'β₁ = Cov(X,Y) / Var(X)',
    'INNER JOIN loans ON id',
    'ConfusionMatrix: 96.8% Acc',
    'RandomForest(estimators=150)',
    'F1-Score: 0.91',
    'P(Y|X) = P(X|Y)P(Y)/P(X)'
  ];

  let floatingChips = [];
  function initDataStreamFormulas() {
    floatingChips = [];
    const count = Math.min(Math.max(Math.floor(width / 130), 8), 15);
    for (let i = 0; i < count; i++) {
      floatingChips.push({
        text: formulasData[i % formulasData.length],
        x: Math.random() * (width - 160) + 20,
        y: Math.random() * height,
        vy: -(Math.random() * 0.35 + 0.2),
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.35 + 0.22,
        size: Math.random() > 0.5 ? 11 : 12
      });
    }
  }
  initDataStreamFormulas();

  // -------------------------------------------------------------
  // D. Animation Frame Loop
  // -------------------------------------------------------------
  let time = 0;

  function animate() {
    time += 0.018;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    ctx.clearRect(0, 0, width, height);

    // --- 1. Coordinate Grid with Crosshairs & Scanning Sensor Beam ---
    const gridStep = 95;
    const scanX = ((time * 75) % (width + 600)) - 300;

    ctx.lineWidth = 0.6;
    for (let x = 30; x < width; x += gridStep) {
      for (let y = 30; y < height; y += gridStep) {
        const distToScan = Math.abs(x - scanX);
        let alpha = isDark ? 0.08 : 0.06;

        if (distToScan < 120) {
          alpha += (1 - distToScan / 120) * 0.28;
        }

        ctx.strokeStyle = isDark ? `rgba(0, 242, 254, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;

        // Draw coordinate crosshair '+'
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);
        ctx.stroke();
      }
    }

    // --- 2. Live Continuous Financial / Risk Regression Trend Waves ---
    const waveY = height * 0.56;
    const waveY2 = waveY + 45;

    // Draw area corridor
    ctx.beginPath();
    for (let x = 0; x <= width; x += 18) {
      const y1 = waveY + Math.sin(x * 0.0032 + time * 0.9) * 45 + Math.cos(x * 0.0016 - time * 0.5) * 22;
      if (x === 0) ctx.moveTo(x, y1);
      else ctx.lineTo(x, y1);
    }
    for (let x = width; x >= 0; x -= 18) {
      const y2 = waveY2 + Math.sin(x * 0.0035 + time * 0.75) * 40 + Math.cos(x * 0.002 + time * 0.4) * 25;
      ctx.lineTo(x, y2);
    }
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.035)' : 'rgba(2, 132, 199, 0.025)';
    ctx.fill();

    // Primary trend line (Bullish / Cumulative return line)
    ctx.beginPath();
    for (let x = 0; x <= width; x += 12) {
      const y = waveY + Math.sin(x * 0.0032 + time * 0.9) * 45 + Math.cos(x * 0.0016 - time * 0.5) * 22;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDark ? 'rgba(0, 242, 254, 0.38)' : 'rgba(2, 132, 199, 0.35)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Risk threshold line (Lower corridor boundary)
    ctx.beginPath();
    for (let x = 0; x <= width; x += 12) {
      const y = waveY2 + Math.sin(x * 0.0035 + time * 0.75) * 40 + Math.cos(x * 0.002 + time * 0.4) * 25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDark ? 'rgba(157, 78, 221, 0.28)' : 'rgba(124, 58, 237, 0.25)';
    ctx.lineWidth = 1.1;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live markers moving on wave
    const sampleX = ((time * 48) % width);
    const sampleY = waveY + Math.sin(sampleX * 0.0032 + time * 0.9) * 45 + Math.cos(sampleX * 0.0016 - time * 0.5) * 22;

    ctx.beginPath();
    ctx.arc(sampleX, sampleY, 4, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#00f2fe' : '#0284c7';
    ctx.fill();

    ctx.font = '10px monospace';
    ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.65)' : 'rgba(2, 132, 199, 0.75)';
    ctx.fillText(`[μ: ${Math.round(sampleY)}]`, sampleX + 8, sampleY - 6);

    // --- 2.1 Gaussian Normal Distribution Bell Curve ---
    const bellCenterX = width * 0.74;
    const bellCenterY = height * 0.28;
    const bellSigma = 52;
    const bellHeight = 56;

    ctx.beginPath();
    for (let x = bellCenterX - 150; x <= bellCenterX + 150; x += 4) {
      const diff = (x - bellCenterX) / bellSigma;
      const y = bellCenterY - Math.exp(-0.5 * diff * diff) * bellHeight;
      if (x === bellCenterX - 150) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(5, 150, 105, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Fill under bell curve
    ctx.lineTo(bellCenterX + 150, bellCenterY);
    ctx.lineTo(bellCenterX - 150, bellCenterY);
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(5, 150, 105, 0.03)';
    ctx.fill();

    // Dashed Sigma lines (+1σ, -1σ, μ)
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(5, 150, 105, 0.28)';
    [-bellSigma, 0, bellSigma].forEach(offset => {
      const x = bellCenterX + offset;
      const diff = offset / bellSigma;
      const y = bellCenterY - Math.exp(-0.5 * diff * diff) * bellHeight;
      ctx.beginPath();
      ctx.moveTo(x, bellCenterY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.font = '10px monospace';
    ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.65)' : 'rgba(5, 150, 105, 0.7)';
    ctx.fillText('N(μ, σ²) [GAUSSIAN RISK CI: 95%]', bellCenterX - 65, bellCenterY + 16);

    // --- 2.2 Live Financial Candlestick & Volume Stream ---
    const candleY = height * 0.84;
    const candleSpacing = 36;
    const candleCount = Math.floor(width / candleSpacing) + 2;

    for (let i = 0; i < candleCount; i++) {
      const cx = i * candleSpacing;
      const seed = Math.sin(i * 1.35 + time * 1.15);
      const isUp = seed > 0;
      const bodyHeight = Math.abs(seed) * 24 + 6;
      const wickTop = bodyHeight + Math.abs(Math.cos(i * 2.1 + time)) * 12;
      const wickBottom = bodyHeight + Math.abs(Math.sin(i * 1.8 - time)) * 10;

      const candleColor = isUp
        ? (isDark ? 'rgba(0, 242, 254, 0.45)' : 'rgba(2, 132, 199, 0.45)')
        : (isDark ? 'rgba(244, 63, 94, 0.42)' : 'rgba(225, 29, 72, 0.42)');

      // Wick line
      ctx.strokeStyle = candleColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, candleY - wickTop);
      ctx.lineTo(cx, candleY + wickBottom);
      ctx.stroke();

      // Body rectangle
      ctx.fillStyle = candleColor;
      const topY = isUp ? candleY - bodyHeight : candleY;
      ctx.fillRect(cx - 4.5, topY, 9, bodyHeight);
    }

    // Candle Baseline & Label
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, candleY);
    ctx.lineTo(width, candleY);
    ctx.stroke();

    ctx.font = '10px monospace';
    ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.55)' : 'rgba(2, 132, 199, 0.65)';
    ctx.fillText('FINANCIAL CANDLESTICK & RISK STREAM [LIVE]', 25, candleY - 38);

    // --- 2.3 Data Matrix Ticker Columns ---
    const streamCols = 7;
    for (let c = 0; c < streamCols; c++) {
      const colX = (width / (streamCols + 1)) * (c + 1);
      const offset = c * 45;
      const colY = ((time * 35 + offset) % (height + 200)) - 100;

      ctx.font = '10px monospace';
      ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.22)' : 'rgba(2, 132, 199, 0.22)';
      ctx.fillText(`0.${Math.floor(Math.abs(Math.sin(c + time)) * 9000 + 1000)}`, colX, colY);
      ctx.fillText(`+${(Math.abs(Math.cos(c * 2 + time)) * 4.2).toFixed(2)}%`, colX, colY + 16);
    }

    // --- 3. Neural Data Node Network ---
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.16);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isDark ? `rgba(0, 242, 254, ${lineAlpha})` : `rgba(2, 132, 199, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Update & draw nodes
    nodes.forEach(n => {
      n.update();
      n.draw(isDark);
    });

    // Update & draw traveling data packets
    packets.forEach(p => {
      p.update();
      p.draw(isDark);
    });

    // --- 4. Floating Data Science & Financial Formulas ---
    floatingChips.forEach(chip => {
      chip.y += chip.vy;
      chip.x += chip.vx;

      if (chip.y < -20) {
        chip.y = height + 20;
        chip.x = Math.random() * (width - 160) + 20;
        chip.text = formulasData[Math.floor(Math.random() * formulasData.length)];
      }

      ctx.font = `${chip.size}px 'Space Grotesk', 'Courier New', monospace`;
      ctx.fillStyle = isDark
        ? `rgba(0, 242, 254, ${chip.alpha})`
        : `rgba(14, 116, 144, ${chip.alpha * 0.9})`;
      ctx.fillText(chip.text, chip.x, chip.y);
    });

    // --- 5. Interactive Mouse HUD & Inspection Ring ---
    if (mouse.x !== null && mouse.y !== null) {
      // Analytical Crosshair HUD around cursor
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 28, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(0, 242, 254, 0.45)' : 'rgba(2, 132, 199, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mini corner ticks
      ctx.beginPath();
      ctx.moveTo(mouse.x - 38, mouse.y);
      ctx.lineTo(mouse.x - 28, mouse.y);
      ctx.moveTo(mouse.x + 28, mouse.y);
      ctx.lineTo(mouse.x + 38, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 38);
      ctx.lineTo(mouse.x, mouse.y - 28);
      ctx.moveTo(mouse.x, mouse.y + 28);
      ctx.lineTo(mouse.x, mouse.y + 38);
      ctx.stroke();

      // Readout text next to cursor
      ctx.font = '10px monospace';
      ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.75)' : 'rgba(2, 132, 199, 0.85)';
      ctx.fillText(`X:${Math.round(mouse.x)} Y:${Math.round(mouse.y)} [DATA:ACTIVE]`, mouse.x + 36, mouse.y + 4);

      // Connect mouse to nearest nodes & draw dynamic OLS best-fit regression line
      const connectedNodes = [];
      for (let i = 0; i < nodes.length && connectedNodes.length < 4; i++) {
        const dx = mouse.x - nodes[i].x;
        const dy = mouse.y - nodes[i].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(nodes[i].x, nodes[i].y);
          ctx.strokeStyle = isDark ? `rgba(157, 78, 221, ${alpha})` : `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          connectedNodes.push(nodes[i]);
        }
      }

      // Dynamic OLS Regression Line through connected nodes
      if (connectedNodes.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(connectedNodes[0].x, connectedNodes[0].y);
        ctx.lineTo(connectedNodes[1].x, connectedNodes[1].y);
        ctx.strokeStyle = isDark ? 'rgba(0, 242, 254, 0.75)' : 'rgba(2, 132, 199, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '10px monospace';
        ctx.fillStyle = isDark ? '#00f2fe' : '#0284c7';
        ctx.fillText('OLS REGRESSION [R²=0.984]', (connectedNodes[0].x + connectedNodes[1].x) / 2 + 10, (connectedNodes[0].y + connectedNodes[1].y) / 2);
      }
    }

    // --- 6. Click Shockwave Ripples ---
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 5.5;
      r.alpha -= 0.022;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? `rgba(0, 242, 254, ${r.alpha})` : `rgba(2, 132, 199, ${r.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   5. TOP SCROLL PROGRESS BAR
   =================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/* ===================================================================
   6. NAVBAR & ACTIVE NAVIGATION LINK TRACKING
   =================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        mobileDrawer.classList.remove('open');
      }
    });
  }

  // Back to top button action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSound('click');
    });
  }

  // Scroll spy & navbar styling
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Toggle Back To Top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Active nav link highlight
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ===================================================================
   7. TYPEWRITER EFFECT
   =================================================================== */
let typewriterTimeout = null;

function initTypewriter() {
  const textElement = document.getElementById('typewriter');
  if (!textElement) return;

  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
  }

  const roles = (typeof translations !== 'undefined' && translations[currentLang]?.typewriterRoles)
    ? translations[currentLang].typewriterRoles
    : [
      'Bilgisayar Mühendisliği Öğrencisiyim.',
      'Veri & Risk Analitiği Adayıyım.',
      'Finansal Veri & Karar Destek Odaklıyım.',
      'Python & SQL ile Değer Üretiyorum.'
    ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex] || '';

    if (isDeleting) {
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 450; // Pause before typing new text
    }

    typewriterTimeout = setTimeout(type, typeSpeed);
  }

  type();
}

/* ===================================================================
   8. 3D TILT EFFECT (AVATAR CARD)
   =================================================================== */
function initTiltEffect() {
  const card = document.getElementById('hero-tilt-card');
  if (!card) return;

  const inner = card.querySelector('.avatar-card-inner');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ===================================================================
   9. INTERACTIVE NUMBER COUNTERS
   =================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) counterObserver.observe(statsSection);
}

/* ===================================================================
   10. SKILLS & PROJECTS FILTER TABS
   =================================================================== */
function initFilterTabs() {
  // Skills filter
  const skillTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('#skills-grid .skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // Projects filter
  const projectTabs = document.querySelectorAll('.project-tab');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-pfilter');

      projectCards.forEach(card => {
        const categoryAttr = card.getAttribute('data-category') || '';
        const categories = categoryAttr.split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   11. EXPERIENCE & EDUCATION TIMELINE SWITCHER
   =================================================================== */
function initTimelineSwitcher() {
  const btnExp = document.getElementById('btn-show-exp');
  const btnEdu = document.getElementById('btn-show-edu');
  const timelineExp = document.getElementById('timeline-experience');
  const timelineEdu = document.getElementById('timeline-education');

  if (btnExp && btnEdu && timelineExp && timelineEdu) {
    btnExp.addEventListener('click', () => {
      btnExp.classList.add('active');
      btnEdu.classList.remove('active');
      timelineExp.classList.remove('hidden');
      timelineEdu.classList.add('hidden');
      playSound('toggle');
    });

    btnEdu.addEventListener('click', () => {
      btnEdu.classList.add('active');
      btnExp.classList.remove('active');
      timelineEdu.classList.remove('hidden');
      timelineExp.classList.add('hidden');
      playSound('toggle');
    });
  }
}

/* ===================================================================
   12. INTERACTIVE MODALS & DIRECT CV PDF ROUTER
   =================================================================== */
function initModals() {
  const CV_PDF_URL = 'assets/Efe_Fevzi_Turkel_CV.pdf';
  const CV_TRIGGER_SELECTOR = [
    '[data-cv-action]',
    '#open-cv-btn',
    '#mobile-cv-btn',
    '#hero-cv-btn',
    '#about-cv-btn',
    '#cta-open-cv-btn',
    '#cta-download-cv-btn',
    '#cv-mockup-link',
    '#footer-cv-btn',
    '#cv-print-btn'
  ].join(', ');

  const cvModal = document.getElementById('cv-modal');
  const closeCvModalBtn = document.getElementById('close-cv-modal');
  const cvCloseBottomBtn = document.getElementById('cv-close-bottom');

  // Strict allowlist validation against Open Redirect / Path Traversal / URI injection
  function isSafePdfUrl(url) {
    return typeof url === 'string' && /^assets\/[A-Za-z0-9_.-]+\.pdf$/.test(url);
  }

  function openCV(e) {
    if (!isSafePdfUrl(CV_PDF_URL)) return;
    playSound('click');

    // Close mobile navigation drawer if open
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileDrawer) mobileDrawer.classList.remove('open');

    // If triggered via a native <a href="assets/Efe_Fevzi_Turkel_CV.pdf">, let browser open PDF directly
    const triggerEl = e && e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (triggerEl && triggerEl.getAttribute('href') === CV_PDF_URL) {
      return;
    }

    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const newWin = window.open(CV_PDF_URL, '_blank', 'noopener,noreferrer');
    if (newWin) {
      newWin.opener = null;
    } else {
      window.location.href = CV_PDF_URL;
    }
  }

  function closeCV() {
    if (cvModal) {
      cvModal.classList.remove('open');
      document.body.style.overflow = '';
      playSound('click');
    }
  }

  // Global event delegation: any CV trigger anywhere on the site directly opens the PDF
  document.addEventListener('click', (e) => {
    const trigger = e.target && e.target.closest ? e.target.closest(CV_TRIGGER_SELECTOR) : null;
    if (trigger) {
      openCV(e);
    }
  });

  window.openCV = openCV;

  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', closeCV);
  if (cvCloseBottomBtn) cvCloseBottomBtn.addEventListener('click', closeCV);

  // Project Detail Modal
  const projectModal = document.getElementById('project-modal');
  const closeProjectModalBtn = document.getElementById('close-project-modal');
  const projectContent = document.getElementById('project-modal-content');

  const projectData = {
    1: {
      title: 'Kredi Risk Analitiği & Portföy Performans Paneli',
      category: 'Finansal Veri & Kredi Risk Analitiği',
      image: 'assets/credit_risk_dashboard.png',
      description: 'Müşteri demografisi, kredi türleri ve taksit geri ödeme verilerini entegre ederek kredi portföyünün temerrüt (default) ve gecikme dinamiklerini inceleyen uçtan uca analitik risk yönetimi projesi. Ham ilişkisel veritabanı verileri SQL ile modellenmiş ve temizlenmiş; ardından Excel ortamında dinamik bir Yönetici Risk Paneli (Executive Risk Dashboard) haline getirilmiştir.',
      features: [
        'İlişkisel Veri Modellemesi: musteriler, krediler ve taksitler tablolarının INNER JOIN ile birleştirilmesi',
        'İş Mantığına Dayalı Risk Sınıflandırması: CASE WHEN mantığıyla 0-30 gün (Normal), 31-90 gün (Riskli/Yakın İzleme) ve 90+ gün (Batık / Temerrüt - NPL) segmentasyonu',
        'Dinamik Yönetici KPI Kartları: Portföy bazında Toplam Tahsilat ve Riskli / Batık Tutar hücre tabanlı hesaplamaları',
        'Görsel Dağılım Grafikleri: 2B Pasta Grafiği ile portföy risk ağırlığı, 2B Kümelenmiş Sütun Grafiği ile meslek grubu bazlı tahsilat hacmi analizi',
        'Dinamik Slicer & Rapor Bağlantıları: Şehir ve kredi türü dilimleyicilerinin tüm Pivot tablolara bağlanarak tek tıkla senkronize filtreleme sağlaması',
        'Stratejik Analitik Çıkarımlar: Yüksek tahsilat hacimli meslek gruplarında yoğunlaşan gecikmeler tespit edilerek ek teminat kriteri önerildi'
      ],
      tech: ['SQL (PostgreSQL / MySQL)', 'Excel Pivot Tables', 'Dilimleyiciler (Slicers)', 'Rapor Bağlantıları', 'KPI Mimarisi', 'Portföy Risk Modellemesi'],
      github: 'https://github.com/efe-turkel/credit-risk-analytics-dashboard',
      demo: 'https://github.com/efe-turkel/credit-risk-analytics-dashboard'
    },
    2: {
      title: 'E-Ticaret Satış & Operasyonel Analitik Paneli',
      category: 'E-Ticaret Analitiği & Karar Destek',
      image: 'assets/ecommerce_dashboard.png',
      description: 'İlişkisel veritabanı mimarisi kurarak ham e-ticaret satış, müşteri ve sipariş verilerini SQL ile işleyen; elde edilen veri modelini Excel üzerinden kârlılık, operasyonel fire ve bölgesel performans metriklerine dönüştüren uçtan uca analitik karar destek paneli.',
      features: [
        'İlişkisel Veritabanı Mimarisi: musteriler, urunler ve siparisler tabloları arasında Foreign Key ilişkileri ve SQL sorgu optimizasyonu',
        'Veri Temizleme & Standardizasyon: Sayısal format dönüşümleri, kuruş ayracı optimizasyonu ve kârlılık formülasyonları',
        'Operasyonel Kayıp & İade Matrisi: Giyim (%0 fire ile en stabil grup), Ev Yaşam (%25 iade oranı) ve Elektronik (%28,58 operasyonel kayıp) analizi',
        'Bölgesel Ciro Analitiği: 32.350 TL toplam cironun %51,6\'sını (16.700 TL) oluşturan İstanbul ve sırasıyla İzmir, Ankara, Antalya, Bursa pazar dağılımı',
        'Çoklu Pivot Table & Slicers: Tek panel üzerinden departman ve kategori bazlı anlık interaktif filtreleme desteği'
      ],
      tech: ['SQL (Foreign Key & JOIN)', 'Excel Dinamik Dashboard', 'Pivot Tablolar', 'Operasyonel Metrikler', 'Veri Temizleme', 'Kârlılık Analizi'],
      github: 'https://github.com/efe-turkel/ecommerce-sales-sql-excel',
      demo: 'https://github.com/efe-turkel/ecommerce-sales-sql-excel'
    }
  };

  function openProjectModal(id) {
    window._currentProjectId = id;
    const isEn = currentLang === 'en';
    const data = (typeof projectModalData !== 'undefined' && projectModalData[id] && projectModalData[id][currentLang])
      ? projectModalData[id][currentLang]
      : projectData[id];
    if (!data || !projectContent) return;

    const featuresHeading = isEn
      ? '<i class="fa-solid fa-sparkles text-glow"></i> Key Features & Analytical Takeaways:'
      : '<i class="fa-solid fa-sparkles text-glow"></i> Temel Özellikler & Analitik Çıkarımlar:';
    const techHeading = isEn
      ? '<i class="fa-solid fa-code"></i> Tech Stack & Methodologies:'
      : '<i class="fa-solid fa-code"></i> Kullanılan Teknolojiler & Beceriler:';
    const githubBtnLabel = data.githubBtnText || (isEn ? 'Open GitHub Repository & Inspect Code' : 'GitHub Deposunu Aç & Kodları İncele');

    projectContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="project-category-badge" style="position: static; margin-bottom: 12px; display: inline-block;">${data.category}</span>
        <h2 style="font-size: 1.8rem; margin-top: 8px; margin-bottom: 12px;">${data.title}</h2>
      </div>
      <div style="border-radius: 16px; overflow: hidden; margin-bottom: 24px; max-height: 400px; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: auto; max-height: 380px; object-fit: contain; display: block;">
      </div>
      <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; font-size: 1.05rem;">
        ${data.description}
      </p>
      <h4 style="margin-bottom: 12px; font-size: 1.15rem;">${featuresHeading}</h4>
      <ul style="padding-left: 20px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.7;">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <h4 style="margin-bottom: 12px; font-size: 1.15rem;">${techHeading}</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
        ${data.tech.map(t => `<span style="font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 999px; background: var(--bg-glass); border: 1px solid var(--border-color); color: var(--accent-cyan);">${t}</span>`).join('')}
      </div>
      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-glow btn-sm">
          <i class="fa-brands fa-github"></i> ${githubBtnLabel}
        </a>
      </div>
    `;

    if (projectModal) {
      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSound('click');
    }
  }

  window.openProjectModal = openProjectModal;

  function closeProjectModal() {
    window._currentProjectId = null;
    if (projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
      playSound('click');
    }
  }

  document.querySelectorAll('.project-quick-view-btn, .project-live-demo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project');
      if (pId) openProjectModal(pId);
    });
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);

  // Close modals on clicking overlay background
  [cvModal, projectModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cvModal) cvModal.classList.remove('open');
      if (projectModal) projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ===================================================================
   13. INTERACTIVE CONTACT FORM WITH VALIDATION & TOAST
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');

  if (!form) return;

  const fields = [
    { input: document.getElementById('form-name'), error: document.getElementById('name-error') },
    { input: document.getElementById('form-email'), error: document.getElementById('email-error'), isEmail: true },
    { input: document.getElementById('form-subject'), error: document.getElementById('subject-error') },
    { input: document.getElementById('form-message'), error: document.getElementById('message-error') }
  ];

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  let lastSubmitTime = 0;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Anti-spam Honeypot check
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      form.reset();
      return;
    }

    // Client-side rate limit (60s cooldown against spam flooding)
    const now = Date.now();
    if (now - lastSubmitTime < 60000) {
      const waitMsg = currentLang === 'en'
        ? 'Please wait a moment before sending another message.'
        : 'Yeni bir mesaj göndermeden önce lütfen 1 dakika bekleyiniz.';
      showToast(waitMsg, 'warning');
      return;
    }

    let isValid = true;

    fields.forEach(({ input, error, isEmail }) => {
      if (!input) return;
      const val = input.value.trim();

      if (!val) {
        error.classList.add('show');
        input.style.borderColor = '#ff4757';
        isValid = false;
      } else if (isEmail && !validateEmail(val)) {
        error.classList.add('show');
        input.style.borderColor = '#ff4757';
        isValid = false;
      } else {
        error.classList.remove('show');
        input.style.borderColor = '';
      }
    });

    if (!isValid) {
      playSound('click');
      return;
    }

    // Real asynchronous sending to Formspree
    const t = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : null;
    if (submitBtn && btnText) {
      submitBtn.disabled = true;
      btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (t?.formSending || 'Gönderiliyor...');
    }

    const formData = new FormData(form);

    fetch('https://formspree.io/f/maeelbre', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          lastSubmitTime = Date.now();
          form.reset();
          playSound('success');
          showToast(t?.formSuccess || 'Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağım. 🚀', 'success');
        } else {
          return response.json().then(data => {
            throw new Error((data && data.error) || 'Mesaj gönderilemedi');
          });
        }
      })
      .catch(error => {
        console.error('Formspree submission error:', error);
        playSound('click');
        showToast(t?.formErrorGeneral || 'Bir hata oluştu. Lütfen doğrudan efefturkel@gmail.com adresine yazınız.', 'warning');
      })
      .finally(() => {
        if (submitBtn && btnText) {
          submitBtn.disabled = false;
          btnText.textContent = t?.formBtnSubmit || 'Mesajı Gönder';
        }
      });
  });
}

/* ===================================================================
   14. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const safeType = ['success', 'warning', 'info', 'error'].includes(type) ? type : 'info';
  toast.className = `toast ${safeType}`;

  const icon = document.createElement('i');
  icon.className = `fa-solid ${safeType === 'success' ? 'fa-circle-check' : 'fa-circle-info'}`;

  const textSpan = document.createElement('span');
  textSpan.textContent = String(message);

  toast.appendChild(icon);
  toast.appendChild(textSpan);
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ===================================================================
   15. SMOOTH SCROLL REVEAL OBSERVER
   =================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Keep observing or unobserve to freeze in visible state
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}


/* ===================================================================
   16. INTRO CURTAIN & ADVANCED SCROLL / INTERACTION EFFECTS
   =================================================================== */
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
    if (finePointer && !reduceMotion) {
      setupMagnetic();
      setupDataCursor();
    }
    const dots = setupDots();
    setupScrollEffects(dots);
  });

  function setupIntroCleanup() {
    const intro = document.getElementById('fx-intro');
    if (intro) setTimeout(() => intro.remove(), 3800);
  }

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

  function setupDots() {
    const ids = ['hero', 'about', 'skills', 'experience', 'projects', 'cv-section', 'contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const wrap = document.createElement('nav');
    wrap.className = 'fx-dots';
    wrap.setAttribute('aria-label', 'Bölüm gezintisi');

    // Data Pipeline Telemetry Header & Progress Rail
    const telemetry = document.createElement('span');
    telemetry.className = 'fx-telemetry';
    telemetry.textContent = '0%';
    wrap.appendChild(telemetry);

    const rail = document.createElement('span');
    rail.className = 'fx-dots-rail';
    rail.setAttribute('aria-hidden', 'true');
    wrap.appendChild(rail);

    const labelFor = id => {
      const link = document.querySelector('#nav-links a[href="#' + id + '"]');
      if (link) return link.textContent.trim();
      return root.lang === 'en' ? 'Resume' : 'Özgeçmiş';
    };

    const dots = sections.map((sec, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fx-dot';
      const prefix = '0' + (idx + 1) + ' · ';
      b.setAttribute('aria-label', labelFor(sec.id));
      b.dataset.label = prefix + labelFor(sec.id);
      b.addEventListener('mouseenter', () => { b.dataset.label = prefix + labelFor(sec.id); });
      b.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      wrap.appendChild(b);
      return { el: b, sec, idx };
    });

    document.body.appendChild(wrap);
    setTimeout(() => wrap.classList.add('fx-visible'), 3600);
    window._refreshFxDots = () => {
      dots.forEach(d => {
        const lbl = labelFor(d.sec.id);
        d.el.setAttribute('aria-label', lbl);
        d.el.dataset.label = '0' + (d.idx + 1) + ' · ' + lbl;
      });
    };
    return { dots, wrap, telemetry };
  }

  function setupScrollEffects(dotState) {
    const { dots, wrap, telemetry } = dotState;
    const sections = Array.from(document.querySelectorAll('main > section'));
    const auroras = Array.from(document.querySelectorAll('.aurora-glow'));
    const heroVisual = document.querySelector('.hero-visual');
    const tideTrack = document.getElementById('scroll-tide-track');
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
    const auroraSpeed = [0.10, 0.18, 0.06];
    let ticking = false;
    let wasOn = true;
    let lastY = window.scrollY;
    let skewTimer = 0;

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
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const pct = clamp(Math.round((y / maxScroll) * 100), 0, 100);

      // Update Data Pipeline Rail & Telemetry Readout
      if (wrap) wrap.style.setProperty('--rail-fill', pct + '%');
      if (telemetry) telemetry.textContent = pct + '%';

      if (!reduceMotion) {
        // Scroll Tide Velocity Skew
        const dy = clamp(y - lastY, -60, 60);
        lastY = y;
        if (tideTrack) {
          tideTrack.style.setProperty('--tide-skew', (dy * -0.18).toFixed(2));
          clearTimeout(skewTimer);
          skewTimer = setTimeout(() => tideTrack.style.setProperty('--tide-skew', '0'), 140);
        }

        sections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          const start = vh * 0.6;
          const exit = clamp((start - r.bottom) / start, 0, 1);
          sec.style.setProperty('--exit', exit.toFixed(3));
        });

        auroras.forEach((a, i) => {
          a.style.translate = '0 ' + (-y * (auroraSpeed[i] || 0.08)).toFixed(1) + 'px';
        });
        if (heroVisual) {
          const p = clamp(y, 0, vh * 1.2);
          heroVisual.style.translate = '0 ' + (-p * 0.08).toFixed(1) + 'px';
        }

        // Scroll-Linked Timeline Illumination
        timelineItems.forEach(item => {
          const r = item.getBoundingClientRect();
          const lit = r.top < vh * 0.72 && r.bottom > vh * 0.15;
          item.classList.toggle('tide-lit', lit);
        });
      }

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
    update();
  }

  function setupDataCursor() {
    const ring = document.createElement('div');
    ring.className = 'fx-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);

    const HOVER_SEL = 'a, button, .project-card, .skill-card, .stat-card, .contact-card, input, textarea';
    let raf = 0, tx = -100, ty = -100;

    document.addEventListener('pointermove', e => {
      tx = e.clientX;
      ty = e.clientY;
      if (!ring.classList.contains('is-visible')) ring.classList.add('is-visible');
      const interactive = e.target && e.target.closest && e.target.closest(HOVER_SEL);
      ring.classList.toggle('is-hover', !!interactive);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          ring.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
        });
      }
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      ring.classList.remove('is-visible');
    });
  }
})();

/* ===================================================================
   17. HERO SCENE — CHARACTER & ANIMATED MULTI-MONITOR STAGE
   =================================================================== */
(function () {
  'use strict';

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function hl(line) {
    let out = esc(line);
    if (/^\s*(#|--)/.test(line)) return '<span class="c">' + out + '</span>';
    out = out
      .replace(/(&#39;[^&]*?&#39;|'[^']*')/g, '<span class="s">$1</span>')
      .replace(/\b(import|from|as|def|return|SELECT|FROM|JOIN|INNER|ON|CASE|WHEN|THEN|ELSE|END|GROUP BY|ORDER BY|WITH|AS|AND|for|in|if)\b/g, '<span class="k">$1</span>')
      .replace(/\b(read_csv|merge|groupby|fit|predict|roc_auc_score|SUM|COUNT|AVG|plot|print|train_test_split|RandomForestClassifier)\b/g, '<span class="f">$1</span>')
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="n">$1</span>');
    return out;
  }

  const PY = [
    "import pandas as pd",
    "from sklearn.ensemble import RandomForestClassifier",
    "from sklearn.metrics import roc_auc_score",
    "",
    "# Kredi portfoyu yukle",
    "df = pd.read_csv('loans.csv')",
    "df = df.merge(customers, on='id')",
    "df['dpd'] = df['days_past_due']",
    "",
    "def risk_tier(dpd):",
    "    if dpd <= 30: return 'Normal'",
    "    if dpd <= 90: return 'Watchlist'",
    "    return 'NPL'",
    "",
    "df['tier'] = df['dpd'].apply(risk_tier)",
    "X = df[features]",
    "y = df['default']",
    "model = RandomForestClassifier(300)",
    "model.fit(X_train, y_train)",
    "p = model.predict(X_test)",
    "print(roc_auc_score(y_test, p))"
  ];

  const SQL = [
    "-- risk segmentasyonu",
    "SELECT c.city,",
    "  l.loan_type,",
    "  SUM(i.amount) AS total,",
    "  CASE",
    "    WHEN i.dpd <= 30 THEN 'Normal'",
    "    WHEN i.dpd <= 90 THEN 'Watch'",
    "    ELSE 'NPL'",
    "  END AS tier",
    "FROM customers c",
    "INNER JOIN loans l ON l.cid = c.id",
    "INNER JOIN installments i",
    "  ON i.loan_id = l.id",
    "GROUP BY c.city, l.loan_type",
    "ORDER BY total DESC;",
    "",
    "WITH npl AS (",
    "  SELECT * FROM loans",
    "  WHERE dpd > 90",
    ")",
    "SELECT COUNT(*) FROM npl;"
  ];

  function codeTrack(lines) {
    const html = lines.map(hl).join('\n');
    return '<code class="mon-code-track">' + html + '\n\n' + html + '\n\n</code>';
  }

  function dashboard() {
    const bars = [
      [0.35, 0.8], [0.5, 0.95], [0.3, 0.65], [0.6, 1], [0.4, 0.75],
      [0.55, 0.9], [0.25, 0.6], [0.5, 0.85], [0.35, 0.7]
    ].map((b, i) =>
      '<span style="--b1:' + b[0] + ';--b2:' + b[1] + ';--bd:' + (2 + (i % 4) * 0.45).toFixed(2) +
      's;--bdel:' + (i * 0.18).toFixed(2) + 's"></span>'
    ).join('');

    return (
      '<div class="mon-dash">' +
      '<div class="dash-kpis">' +
      '<div class="dash-kpi">AUC<b>0.94</b></div>' +
      '<div class="dash-kpi">NPL<b>1.8%</b></div>' +
      '<div class="dash-kpi">ROWS<b>150K</b></div>' +
      '</div>' +
      '<div class="dash-bars">' + bars + '</div>' +
      '<svg class="dash-line" viewBox="0 0 120 30" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0,24 C12,22 18,10 30,14 C42,18 48,6 62,9 C76,12 82,20 96,12 C106,7 112,5 120,3"/>' +
      '</svg>' +
      '</div>'
    );
  }

  function bits() {
    const chars = ['</>', '{ }', '01', 'SQL', 'df', 'AUC', '=>', 'ML', '1010', 'NPL'];
    return chars.map((c, i) =>
      '<span style="--x:' + (8 + i * 9) + '%;--t:' + (8 + (i % 4) * 2) + 's;--d:' + (-i * 1.3).toFixed(1) + 's">' + esc(c) + '</span>'
    ).join('');
  }

  function build(mount) {
    const src = mount.dataset.char || 'assets/efe_character.png';
    const alt = mount.dataset.alt || 'Efe Fevzi Türkel';
    const bg = mount.dataset.bg || 'assets/desk_scene.jpg';
    mount.classList.add('hero-scene');
    mount.innerHTML =
      '<div class="scene-stage">' +
      '<img class="scene-bg" src="' + bg + '" alt="" aria-hidden="true" draggable="false">' +
      '<div class="screen-glow g-left"></div>' +
      '<div class="screen-glow g-center"></div>' +
      '<div class="screen-glow g-right"></div>' +
      '<div class="scene-screen s-left"><div class="screen-inner">' +
      '<div class="mon-bar"><i></i><i></i><i></i><span>risk_model.py</span></div>' +
      '<div class="mon-code">' + codeTrack(PY) + '</div>' +
      '</div></div>' +
      '<div class="scene-screen s-center"><div class="screen-inner">' +
      '<div class="mon-bar"><i></i><i></i><i></i><span>credit_risk.sql</span></div>' +
      '<div class="mon-code">' + codeTrack(SQL) + '</div>' +
      '</div></div>' +
      '<div class="scene-screen s-right"><div class="screen-inner">' +
      '<div class="mon-bar"><i></i><i></i><i></i><span>dashboard.xlsx</span></div>' +
      dashboard() +
      '</div></div>' +
      '</div>' +
      '<div class="scene-backlight"></div>' +
      '<div class="scene-bits" aria-hidden="true">' + bits() + '</div>' +
      '<img class="scene-char" id="profile-img" src="' + src + '" alt="' + alt + '" draggable="false">';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('hero-scene-mount');
    if (mount) build(mount);
  });
})();
