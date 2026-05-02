/* ─── main.js — Dr. Mercer Portfolio ─── */

/* ── 1. NAVBAR scroll effect + active link ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── 2. Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  hamburger.querySelectorAll('span')[1].style.opacity = open ? '0' : '';
  hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

/* ── 3. Intersection Observer — fade-up ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── 4. Stat counter animation ── */
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(el => countObserver.observe(el));

/* ── 5. Hero card 3D tilt on mouse move ── */
const cardStack = document.getElementById('cardStack');
const cardMain  = document.querySelector('.card-main');
if (cardStack && cardMain) {
  cardStack.addEventListener('mousemove', (e) => {
    const rect = cardStack.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 14;
    const ry = ((e.clientX - cx) / rect.width ) * -14;
    cardMain.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  cardStack.addEventListener('mouseleave', () => {
    cardMain.style.transform = '';
  });
}

/* ── 6. Ripple effect on all .btn ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    this.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

/* ── 7. Testimonials carousel ── */
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.t-dot');
let current  = 0;
let autoplay;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

if (slides.length) {
  slides[0].classList.add('active');
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); restartAutoplay(); }));
  function restartAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }
  restartAutoplay();
}

/* ── 8. Contact form submit ── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('form-submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = submitBtn;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    await new Promise(r => setTimeout(r, 1400));

    form.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Request';
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  });
}

/* ── 9. Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 10. Floating badge gentle parallax on scroll ── */
const badges = document.querySelectorAll('.floating-badge');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  badges.forEach((b, i) => {
    b.style.transform = `translateY(${Math.sin(sy * 0.01 + i) * 6}px)`;
  });
}, { passive: true });
