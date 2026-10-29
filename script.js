/**
 * EFE.DEV - PORTFOLIO & INTERACTIVE RESUME APPLICATION LOGIC
 * High-performance vanilla JavaScript with interactive canvas physics,
 * sound synthesis, smooth scroll observers, 3D tilt, and dynamic filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initSoundEffects();
  initTheme();
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

  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      localStorage.setItem('efe_music_enabled', 'true');
      updateMusicUI();
      showToast('🎵 Çalıyor: Eminem - Lose Yourself', 'info');
    }).catch(err => {
      console.warn('Playback error:', err);
      showToast('Müziği başlatmak için lütfen tıklayın', 'warning');
    });
  } else {
    bgMusic.pause();
    musicPlaying = false;
    localStorage.setItem('efe_music_enabled', 'false');
    updateMusicUI();
    showToast('Müzik duraklatıldı 🔇', 'info');
  }
}

function updateMusicUI() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (!soundToggleBtn) return;
  const icon = soundToggleBtn.querySelector('i');

  if (musicPlaying) {
    if (icon) icon.className = 'fa-solid fa-volume-high';
    soundToggleBtn.classList.add('is-playing');
    soundToggleBtn.setAttribute('title', 'Müziği Durdur (Eminem - Lose Yourself)');
    soundToggleBtn.setAttribute('aria-label', 'Müziği Durdur');
  } else {
    if (icon) icon.className = 'fa-solid fa-volume-xmark';
    soundToggleBtn.classList.remove('is-playing');
    soundToggleBtn.setAttribute('title', 'Eminem - Lose Yourself (Çal)');
    soundToggleBtn.setAttribute('aria-label', 'Müziği Çal');
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
  const currentTheme = localStorage.getItem('efe_theme') || 'dark';

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
      showToast(`${newTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} tema etkinleştirildi`, 'info');
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
   3. DYNAMIC INTERACTIVE PARTICLES & CONSTELLATION CANVAS
   =================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Optimized lightweight particle count for silky 60fps performance without CPU/GPU lag
  const particles = [];
  const particleCount = Math.min(Math.max(Math.floor((width * height) / 38000), 25), 45);
  const maxDistance = 110;
  const maxDistSq = maxDistance * maxDistance;

  const mouse = {
    x: null,
    y: null,
    radius: 130
  };
  const mouseRadiusSq = mouse.radius * mouse.radius;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  }, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.5 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, 0.65)' : 'rgba(157, 78, 221, 0.65)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion using squared distance (fast, no sqrt overhead)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouseRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 1.5;
          this.y -= dirY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Fast constellation lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const lineAlpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Connect particles to mouse
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq) {
          const dist = Math.sqrt(distSq);
          const lineAlpha = (1 - dist / mouse.radius) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(157, 78, 221, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
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
function initTypewriter() {
  const textElement = document.getElementById('typewriter');
  if (!textElement) return;

  const roles = [
    'Veri Bilimi Meraklısı.',
    'Veri Analisti Adayı.',
    'Nişantaşı Üniv. Bilgisayar Müh. Öğrencisi.',
    'Python & Makine Öğrenmesi Tutkunu.'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

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

    setTimeout(type, typeSpeed);
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
   12. INTERACTIVE MODALS (CV & PROJECT DETAILS)
   =================================================================== */
function initModals() {
  const cvModal = document.getElementById('cv-modal');
  const openCvButtons = [
    document.getElementById('open-cv-btn'),
    document.getElementById('hero-cv-btn'),
    document.getElementById('about-cv-btn'),
    document.getElementById('cta-open-cv-btn')
  ];
  const closeCvModalBtn = document.getElementById('close-cv-modal');
  const cvCloseBottomBtn = document.getElementById('cv-close-bottom');
  const printCvBtn = document.getElementById('cv-print-btn');
  const ctaDownloadCvBtn = document.getElementById('cta-download-cv-btn');

  function openCV() {
    if (cvModal) {
      cvModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSound('click');
    }
  }

  function closeCV() {
    if (cvModal) {
      cvModal.classList.remove('open');
      document.body.style.overflow = '';
      playSound('click');
    }
  }

  openCvButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', openCV);
  });

  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', closeCV);
  if (cvCloseBottomBtn) cvCloseBottomBtn.addEventListener('click', closeCV);

  // Print / Save as PDF handlers
  function triggerPrint() {
    openCV();
    setTimeout(() => {
      window.print();
    }, 350);
  }

  if (printCvBtn) printCvBtn.addEventListener('click', triggerPrint);
  if (ctaDownloadCvBtn) ctaDownloadCvBtn.addEventListener('click', triggerPrint);

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
    const data = projectData[id];
    if (!data || !projectContent) return;

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
      <h4 style="margin-bottom: 12px; font-size: 1.15rem;"><i class="fa-solid fa-sparkles text-glow"></i> Temel Özellikler & Analitik Çıkarımlar:</h4>
      <ul style="padding-left: 20px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.7;">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <h4 style="margin-bottom: 12px; font-size: 1.15rem;"><i class="fa-solid fa-code"></i> Kullanılan Teknolojiler & Beceriler:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
        ${data.tech.map(t => `<span style="font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 999px; background: var(--bg-glass); border: 1px solid var(--border-color); color: var(--accent-cyan);">${t}</span>`).join('')}
      </div>
      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-glow btn-sm">
          <i class="fa-brands fa-github"></i> GitHub Deposunu Aç & Kodları İncele
        </a>
      </div>
    `;

    if (projectModal) {
      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSound('click');
    }
  }

  function closeProjectModal() {
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
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

    // Simulate sending with loading state
    if (submitBtn && btnText) {
      submitBtn.disabled = true;
      btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...';
    }

    setTimeout(() => {
      if (submitBtn && btnText) {
        submitBtn.disabled = false;
        btnText.innerHTML = 'Mesajı Gönder';
      }
      form.reset();
      playSound('success');
      showToast('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağım. 🚀', 'success');
    }, 1200);
  });
}

/* ===================================================================
   14. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
    <span>${message}</span>
  `;

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
