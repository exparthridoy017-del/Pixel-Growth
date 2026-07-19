/* ====================================================================
   PIXEL & GROWTH — script.js
   All interactive behaviour for the portfolio site.
==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  initLoader();
  initCustomCursor();
  initGrowthCanvas();
  initNavbar();
  initMobileMenu();
  initTypingAnimation();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initPortfolioFilter();
  initAccordion();
  initContactForm();
  initBackToTop();
  initSmoothAnchors();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------- Loading screen ---------------- */
function initLoader(){
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // fallback in case load event already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);
}

/* ---------------- Custom cursor ---------------- */
function initCustomCursor(){
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function loop(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .filter-btn, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ---------------- Signature ambient canvas: "growth grid" ----------------
   A field of small pixel-squares that continuously assemble into
   rising bar/line formations — literalizing "Pixel" + "Growth".
------------------------------------------------------------------- */
function initGrowthCanvas(){
  const canvas = document.getElementById('growthCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#2563EB', '#06B6D4', '#10B981'];
  const count = Math.min(60, Math.floor((w * h) / 34000));

  for (let i = 0; i < count; i++){
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 3 + Math.random() * 4,
      speed: 0.15 + Math.random() * 0.35,
      color: colors[i % colors.length],
      drift: (Math.random() - 0.5) * 0.3,
      alpha: 0.15 + Math.random() * 0.25
    });
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);

    // connecting lines (subtle network / growth-line feel)
    for (let i = 0; i < particles.length; i++){
      for (let j = i + 1; j < particles.length; j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130){
          ctx.strokeStyle = `rgba(37,99,235,${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // pixel squares drifting upward, like data climbing
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;

      if (!reduceMotion){
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10){ p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------- Navbar scroll state ---------------- */
function initNavbar(){
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- Mobile menu ---------------- */
function initMobileMenu(){
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const toggle = (open) => {
    const state = open ?? !menu.classList.contains('open');
    menu.classList.toggle('open', state);
    btn.classList.toggle('active', state);
    btn.setAttribute('aria-expanded', state);
    document.body.style.overflow = state ? 'hidden' : '';
  };

  btn.addEventListener('click', () => toggle());
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
}

/* ---------------- Hero typing animation ---------------- */
function initTypingAnimation(){
  const el = document.getElementById('typedWord');
  if (!el) return;
  const words = ['attention', 'traffic', 'leads', 'sales', 'loyal customers'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const word = words[wordIndex];
    if (!deleting){
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length){
        deleting = true;
        return setTimeout(tick, 1400);
      }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 85);
  }
  setTimeout(tick, 900);
}

/* ---------------- Scroll reveal ---------------- */
function initScrollReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => io.observe(item));
}

/* ---------------- Animated counters ---------------- */
function initCounters(){
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const duration = 1200;
      const start = performance.now();
      function step(now){
        const progress = Math.min((now - start) / duration, 1);
        current = Math.floor(progress * target);
        el.textContent = current;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
}

/* ---------------- Skill progress bars ---------------- */
function initSkillBars(){
  const items = document.querySelectorAll('.skill-item');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.skill-fill');
      const level = entry.target.dataset.level;
      fill.style.width = level + '%';
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  items.forEach(i => io.observe(i));
}

/* ---------------- Portfolio filter ---------------- */
function initPortfolioFilter(){
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });
}

/* ---------------- FAQ accordion ---------------- */
function initAccordion(){
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const head = item.querySelector('.accordion-head');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ---------------- Contact form (front-end only placeholder) ---------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // EDIT: connect this to your backend, form service (e.g. Formspree),
    // or mailto fallback. Currently shows a confirmation message only.
    note.textContent = 'Thanks! Your message has been noted — I\'ll get back to you within a day.';
    form.reset();
  });
}

/* ---------------- Back to top ---------------- */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------- Smooth anchor scroll with navbar offset ---------------- */
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
