/* ============================================
   GANS & SMITH INSURANCE AGENCY
   script.js — Premium Vanilla JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar Scroll Behavior ---- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar && navbar.classList.add('scrolled');
      backToTop && backToTop.classList.add('visible');
    } else {
      navbar && navbar.classList.remove('scrolled');
      backToTop && backToTop.classList.remove('visible');
    }
  });
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Active Nav Link ---- */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  hamburger && hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose && mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ---- Scroll Animations (Intersection Observer) ---- */
  const animEls = document.querySelectorAll('.fade-up, .fade-in');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animEls.forEach(el => observer.observe(el));
  }

  /* ---- Animated Counters ---- */
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ---- Testimonial Slider ---- */
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (track && prevBtn && nextBtn) {
    let index = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    const visible = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const maxIndex = Math.max(0, total - visible);
    function updateSlider() {
      const cardWidth = cards[0].offsetWidth + 24; // gap
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }
    prevBtn.addEventListener('click', () => { if (index > 0) { index--; updateSlider(); } });
    nextBtn.addEventListener('click', () => { if (index < maxIndex) { index++; updateSlider(); } });
    let autoSlide = setInterval(() => { index = index >= maxIndex ? 0 : index + 1; updateSlider(); }, 5000);
    [prevBtn, nextBtn].forEach(btn => btn.addEventListener('click', () => { clearInterval(autoSlide); }));
    window.addEventListener('resize', updateSlider);
  }

  /* ---- Health/Life Tabs ---- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      panel && panel.classList.add('active');
    });
  });

  /* ---- Multi-Step Quote Form ---- */
  const steps = document.querySelectorAll('.quote-step');
  const stepCircles = document.querySelectorAll('.step-circle');
  const stepLabels = document.querySelectorAll('.step-label');
  const progressLines = document.querySelectorAll('.progress-line');
  let currentStep = 0;

  function showStep(n) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    stepCircles.forEach((c, i) => {
      c.classList.toggle('active', i === n);
      c.classList.toggle('done', i < n);
      if (i < n) c.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      else if (i === n) c.textContent = i + 1;
      else c.textContent = i + 1;
    });
    stepLabels.forEach((l, i) => l.classList.toggle('active', i === n));
    progressLines.forEach((l, i) => l.classList.toggle('done', i < n));
    currentStep = n;
  }

  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
    });
  });
  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  /* ---- Coverage Option Selection ---- */
  document.querySelectorAll('.coverage-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.coverage-options').querySelectorAll('.coverage-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  /* ---- Contact/Quote Form Submission ---- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#22c55e';
        setTimeout(() => { btn.textContent = original; btn.disabled = false; btn.style.background = ''; }, 3000);
      }, 1200);
    });
  });

  /* ---- Quote Final Submit ---- */
  const quoteSubmit = document.getElementById('quote-submit');
  quoteSubmit && quoteSubmit.addEventListener('click', () => {
    quoteSubmit.textContent = 'Submitting…';
    quoteSubmit.disabled = true;
    setTimeout(() => {
      quoteSubmit.textContent = '✓ Quote Request Received!';
      quoteSubmit.style.background = '#22c55e';
      quoteSubmit.style.color = '#fff';
    }, 1200);
  });

  /* ---- Smooth External Phone Links ---- */
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => console.log('📞 Calling Gans & Smith…'));
  });

  console.log('%c GANS & SMITH INSURANCE AGENCY ', 'background:#0A1628;color:#C9A84C;font-size:14px;padding:8px 16px;font-family:Georgia,serif;font-weight:bold;');
  console.log('%c Est. 1889 | Longview, Texas ', 'color:#4A5568;font-size:11px;');

});
