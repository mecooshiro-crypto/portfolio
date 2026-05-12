const root = document.documentElement;
const header = document.querySelector('[data-header]');
const cursorOrb = document.querySelector('.cursor-orb');
const cursorDot = document.querySelector('.cursor-dot');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let orbX = mouseX;
let orbY = mouseY;

function onPointerMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  root.style.setProperty('--mx', `${mouseX}px`);
  root.style.setProperty('--my', `${mouseY}px`);

  document.querySelectorAll('.parallax-logo').forEach((logo) => {
    const rect = logo.getBoundingClientRect();
    const dx = (mouseX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (mouseY - (rect.top + rect.height / 2)) / rect.height;
    logo.style.transform = `translate3d(${dx * 12}px, ${dy * 12}px, 34px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
}

function animateCursor() {
  orbX += (mouseX - orbX) * 0.12;
  orbY += (mouseY - orbY) * 0.12;
  if (cursorOrb) cursorOrb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0)`;
  if (cursorDot) cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  requestAnimationFrame(animateCursor);
}

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      entry.target.querySelectorAll?.('.progress-item').forEach((item, index) => {
        setTimeout(() => item.classList.add('is-visible'), 160 * index);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  document.querySelectorAll('.progress-item').forEach((element) => observer.observe(element));
}

function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const depth = Number(card.dataset.depth || 18);
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * depth}deg) rotateY(${x * depth}deg) translateY(-6px)`;
      card.style.setProperty('--card-x', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--card-y', `${(y + 0.5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
      cursorOrb?.style.setProperty('width', '420px');
      cursorOrb?.style.setProperty('height', '420px');
    });
    item.addEventListener('pointerleave', () => {
      item.style.transform = 'translate(0, 0)';
      cursorOrb?.style.setProperty('width', '320px');
      cursorOrb?.style.setProperty('height', '320px');
    });
  });
}

function initMenu() {
  menuToggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function initVideoAutoplay() {
  document.querySelectorAll('video').forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => video.setAttribute('controls', 'controls'));
  });
}

window.addEventListener('pointermove', onPointerMove, { passive: true });
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('load', () => document.body.classList.add('loaded'));

animateCursor();
updateHeader();
initReveal();
initTiltCards();
initMagnetic();
initMenu();
initVideoAutoplay();
