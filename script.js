// DANIL / PERSONAL SPACE — lightweight interactions, no dependencies.
(() => {
  'use strict';

  const header = document.getElementById('header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setMenuOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenuOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) setMenuOpen(false);
  });

  let scheduled = false;
  function setHeaderStyle() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(setHeaderStyle);
    }
  }, { passive: true });
  setHeaderStyle();

  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -42px 0px', threshold: 0.05 });
    if (!reducedMotion.matches) {
      document.documentElement.classList.add('can-reveal');
      revealTargets.forEach(target => revealObserver.observe(target));
    }

    const observedSections = document.querySelectorAll('#home, #about, #looking-for, #contact');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-28% 0px -55% 0px', threshold: 0 });
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.documentElement.classList.remove('can-reveal');
    }
  });
})();
