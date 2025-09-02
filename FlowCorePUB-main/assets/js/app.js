// FlowCore site JS
(function () {
  // Smooth scroll for in-page links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle && menuToggle.checked) menuToggle.checked = false;
  });

  // Sticky header state
  const header = document.querySelector('.header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 4) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Accordions: only one <details> open per group
  function makeAccordion(container) {
    const details = Array.from(container.querySelectorAll('details'));
    details.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (!d.open) return;
        details.forEach((other) => {
          if (other !== d) other.open = false;
        });
      });
      // Keyboard: allow Enter/Space on summary to toggle
      const sum = d.querySelector('summary');
      if (sum) {
        sum.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            d.open = !d.open;
          }
        });
      }
    });
  }

  // Apply to Solutions and each FAQ column
  const solutionsSection = document.querySelector('#solutions');
  if (solutionsSection) {
    makeAccordion(solutionsSection);
  }
  document.querySelectorAll('#faq .faq').forEach(makeAccordion);

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Modal Toggle
  const modal = document.querySelector('[data-animate="modal"]');
  const modalClose = document.querySelector('.modal-close');
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');

  if (modal && modalClose) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.setAttribute('open', '');
      });
    });
    modalClose.addEventListener('click', () => {
      modal.removeAttribute('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal.querySelector('[data-animate="backdrop"]')) {
        modal.removeAttribute('open');
      }
    });
    // Keyboard: Close modal with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.hasAttribute('open')) {
        modal.removeAttribute('open');
      }
    });
  }

  // Card, Badge, and Highlight Animations on Load
  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-animate="card"], [data-animate="badge"], [data-animate="highlight"]');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-in');
        el.addEventListener('transitionend', () => {
          el.classList.add('animation-end');
        }, { once: true });
      }, index * 20); // Stagger by 20ms
    });
  });

  // Cleanup will-change on animation end
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.addEventListener('transitionend', () => {
      el.classList.add('animation-end');
    }, { once: true });
  });
})();
