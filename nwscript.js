// script.js

// ============ LOADER ============
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 600);
});

// ============ STICKY HEADER ============
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive: true });

// ============ MOBILE NAV ============
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
// Close nav when link clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ============ HERO PARTICLES ============
const particlesContainer = document.getElementById('heroParticles');
const particleCount = 18;
for (let i = 0; i < particleCount; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${Math.random() * 100}%`;
  p.style.animationDuration = `${Math.random() * 8 + 8}s`;
  p.style.animationDelay = `${Math.random() * 10}s`;
  p.style.opacity = (Math.random() * 0.4 + 0.2).toFixed(2);
  particlesContainer.appendChild(p);
}

// ============ PARALLAX SCROLLING ============
const heroBg = document.querySelector('.hero-bg');
const parallaxBg = document.querySelector('.parallax-bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroBg && y < window.innerHeight) {
    heroBg.style.transform = `translateY(${y * 0.4}px) scale(1.05)`;
  }
  if (parallaxBg) {
    const rect = parallaxBg.parentElement.getBoundingClientRect();
    const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
    parallaxBg.style.transform = `translateY(${-offset * 0.3}px) scale(1.1)`;
  }
}, { passive: true });

// ============ REVEAL ON SCROLL ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ============ COUNTER ANIMATION ============
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 1800;
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }
    requestAnimationFrame(update);
  });
}
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ============ LIGHTBOX ============
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentIdx = 0;
const imageSources = Array.from(galleryItems).map(item => item.dataset.img);

function openLightbox(idx) {
  currentIdx = idx;
  lightboxImg.src = imageSources[idx];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => lightboxImg.src = '', 400);
}
function navLightbox(dir) {
  currentIdx = (currentIdx + dir + imageSources.length) % imageSources.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = imageSources[currentIdx];
    lightboxImg.style.opacity = '1';
  }, 200);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navLightbox(-1));
lightboxNext.addEventListener('click', () => navLightbox(1));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});

// ============ BACK TO TOP ============
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) backTop.classList.add('visible');
  else backTop.classList.remove('visible');
}, { passive: true });
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ FOOTER YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ SMOOTH SCROLL OFFSET ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 10;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});