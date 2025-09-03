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
    if (window.scrollY > 4) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Accordion setup (FAQ only)
  function makeAccordion(container) {
    const details = Array.from(container.querySelectorAll('details'));
    details.forEach((d) => {
      d.setAttribute('role', 'region');
      const sum = d.querySelector('summary');
      if (!sum) return;
      sum.setAttribute('tabindex', '0');
      sum.setAttribute('aria-expanded', d.open ? 'true' : 'false');
      sum.addEventListener('click', (e) => {
        e.preventDefault();
        details.forEach((other) => {
          if (other !== d) other.removeAttribute('open');
        });
        if (d.hasAttribute('open')) {
          d.removeAttribute('open');
          sum.setAttribute('aria-expanded', 'false');
        } else {
          d.setAttribute('open', '');
          sum.setAttribute('aria-expanded', 'true');
          d.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      sum.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sum.click();
        }
      });
    });
  }
  document.querySelectorAll('#faq .faq').forEach(makeAccordion);

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Modal toggle
  const modal = document.querySelector('.modal');
  const modalClose = document.querySelector('.modal-close');
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  if (modal && modalClose) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.setAttribute('open', '');
      });
    });
    modalClose.addEventListener('click', () => modal.removeAttribute('open'));
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        modal.removeAttribute('open');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.hasAttribute('open')) {
        modal.removeAttribute('open');
      }
    });
  }

  // Animate cards, badges, and highlights on load
  document.addEventListener('DOMContentLoaded', () => {
    const animEls = document.querySelectorAll('[data-animate="card"], [data-animate="badge"], [data-animate="highlight"]');
    animEls.forEach((el, index) => {
      setTimeout(() => el.classList.add('animate-in'), index * 30);
    });
  });

  // Solutions: category filtering with event delegation
  const solutionsContainer = document.querySelector('.solutions-grid');
  const tabContainer = document.querySelector('.category-tabs');
  if (solutionsContainer && tabContainer) {
    const solutionCards = solutionsContainer.querySelectorAll('.solution-card');
    tabContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-button');
      if (!btn) return;
      tabContainer.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;
      solutionCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          setTimeout(() => card.classList.add('animate-in'), 50);
        } else {
          card.classList.add('hidden');
          card.classList.remove('animate-in');
        }
      });
    });

    // Expand/collapse
    solutionsContainer.addEventListener('click', (e) => {
      const expandBtn = e.target.closest('.expand-button');
      const card = e.target.closest('.solution-card');
      if (!card) return;

      if (expandBtn) {
        e.stopPropagation();
        card.classList.toggle('expanded');
        expandBtn.firstChild.textContent = card.classList.contains('expanded') ? 'Less ' : 'Details ';
      } else {
        card.classList.toggle('expanded');
        const btn = card.querySelector('.expand-button');
        if (btn) btn.firstChild.textContent = card.classList.contains('expanded') ? 'Less ' : 'Details ';
      }
    });

    // Initial animation
    setTimeout(() => {
      solutionCards.forEach((card, index) => {
        setTimeout(() => card.classList.add('animate-in'), index * 100);
      });
    }, 200);
  }
})();
