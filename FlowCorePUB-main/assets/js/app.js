// Premium FlowCore JavaScript - Enhanced Performance & Animations
(function() {
  'use strict';

  // Performance optimizations
  const raf = window.requestAnimationFrame;
  const caf = window.cancelAnimationFrame;
  let ticking = false;
  let scrollRAF = null;

  // Enhanced Intersection Observer for scroll animations
  const observerOptions = {
    threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
    rootMargin: '-50px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const element = entry.target;
      const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.1;
      
      if (isVisible && !element.classList.contains('animate-in')) {
        // Staggered animation timing based on element type and position
        const delay = getAnimationDelay(element);
        
        setTimeout(() => {
          element.classList.add('animate-in');
          element.style.willChange = 'transform, opacity';
          
          // Cleanup after animation
          const cleanup = () => {
            element.style.willChange = 'auto';
            element.classList.add('animation-complete');
          };
          
          element.addEventListener('transitionend', cleanup, { once: true });
          // Fallback cleanup
          setTimeout(cleanup, 1000);
        }, delay);
      }
    });
  }, observerOptions);

  // Intelligent animation delay calculation
  function getAnimationDelay(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const distanceFromCenter = Math.abs(elementCenter - viewportHeight / 2);
    
    // Base delays by element type
    const baseDelays = {
      'badge': 50,
      'card': 100,
      'highlight': 150,
      'tile': 75,
      'button': 25
    };
    
    let delay = 0;
    for (const [type, baseDelay] of Object.entries(baseDelays)) {
      if (element.dataset.animate === type) {
        delay = baseDelay;
        break;
      }
    }
    
    // Add index-based stagger for grouped elements
    const siblings = Array.from(element.parentNode.children).filter(
      child => child.dataset.animate === element.dataset.animate
    );
    const index = siblings.indexOf(element);
    delay += index * 50;
    
    // Reduce delay for elements closer to viewport center
    const proximityMultiplier = Math.max(0.3, 1 - (distanceFromCenter / viewportHeight));
    
    return Math.min(delay * proximityMultiplier, 400);
  }

  // Enhanced smooth scrolling with easing
  function smoothScroll(target, offset = 80) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(800, Math.max(300, Math.abs(distance) * 0.5));
    
    let start = null;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      // Cubic bezier easing (0.4, 0, 0.2, 1)
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (progress < 1) {
        raf(step);
      }
    }
    
    raf(step);
  }

  // Enhanced click handler with better UX
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    
    // Close mobile menu with animation
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle?.checked) {
      menuToggle.checked = false;
      
      // Wait for menu close animation before scrolling
      setTimeout(() => smoothScroll(target), 200);
    } else {
      smoothScroll(target);
    }
    
    // Add ripple effect to link
    createRipple(e, link);
  });

  // Premium ripple effect for buttons and links
  function createRipple(event, element) {
    if (!element.dataset.animate?.includes('button') && !element.classList.contains('btn')) return;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    const elementStyle = getComputedStyle(element);
    if (elementStyle.position === 'static') {
      element.style.position = 'relative';
    }
    if (elementStyle.overflow !== 'hidden') {
      element.style.overflow = 'hidden';
    }
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Optimized scroll handler with throttling
  function handleScroll() {
    if (scrollRAF) caf(scrollRAF);
    
    scrollRAF = raf(() => {
      const header = document.querySelector('.header');
      if (!header) return;
      
      const scrolled = window.pageYOffset > 10;
      const hasScrolledClass = header.classList.contains('scrolled');
      
      if (scrolled && !hasScrolledClass) {
        header.classList.add('scrolled');
      } else if (!scrolled && hasScrolledClass) {
        header.classList.remove('scrolled');
      }
      
      scrollRAF = null;
    });
  }

  // Enhanced accordion system with premium animations
  function createPremiumAccordion(container) {
    const details = Array.from(container.querySelectorAll('details'));
    
    details.forEach((detail, index) => {
      // Add smooth open/close animations
      const content = detail.querySelector('p, ul, div');
      if (content) {
        content.style.overflow = 'hidden';
        content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      detail.addEventListener('toggle', (e) => {
        const isOpening = detail.open;
        
        if (isOpening) {
          // Close others with staggered timing for smooth effect
          details.forEach((other, otherIndex) => {
            if (other !== detail && other.open) {
              setTimeout(() => {
                other.open = false;
              }, Math.abs(otherIndex - index) * 50);
            }
          });
          
          // Animate content in
          if (content) {
            content.style.maxHeight = '0';
            raf(() => {
              content.style.maxHeight = content.scrollHeight + 'px';
            });
          }
          
          // Smooth scroll to opened item after animation
          setTimeout(() => {
            const rect = detail.getBoundingClientRect();
            const isAboveViewport = rect.top < 100;
            if (isAboveViewport) {
              smoothScroll(detail, 120);
            }
          }, 200);
          
        } else {
          // Animate content out
          if (content) {
            content.style.maxHeight = '0';
          }
        }
      });
      
      // Enhanced keyboard navigation
      const summary = detail.querySelector('summary');
      if (summary) {
        summary.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            detail.open = !detail.open;
            createRipple(e, summary);
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            const currentIndex = details.indexOf(detail);
            const nextIndex = currentIndex + direction;
            const nextDetail = details[nextIndex];
            
            if (nextDetail) {
              nextDetail.querySelector('summary').focus();
            }
          }
        });
        
        // Add hover sound effect (subtle)
        summary.addEventListener('mouseenter', () => {
          // Optional: Add subtle sound or haptic feedback here
          summary.style.transform = 'translateX(4px)';
        });
        
        summary.addEventListener('mouseleave', () => {
          summary.style.transform = 'translateX(0)';
        });
      }
    });
  }

  // Enhanced modal system
  function initializePremiumModal() {
    const modal = document.querySelector('[data-animate="modal"]');
    const modalClose = document.querySelector('.modal-close');
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const backdrop = modal?.querySelector('[data-animate="backdrop"]');

    if (!modal) return;

    let isAnimating = false;

    function openModal() {
      if (isAnimating) return;
      isAnimating = true;
      
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      raf(() => {
        modal.setAttribute('open', '');
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      });
    }

    function closeModal() {
      if (isAnimating) return;
      isAnimating = true;
      
      modal.removeAttribute('open');
      
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        isAnimating = false;
      }, 300);
    }

    // Event listeners
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        createRipple(e, trigger);
        setTimeout(openModal, 100);
      });
    });

    modalClose?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    // Enhanced keyboard handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.hasAttribute('open')) {
        closeModal();
      }
      
      // Trap focus in modal
      if (modal.hasAttribute('open') && e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // Performance monitoring and optimization
  function optimizePerformance() {
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
    ];
    
    preloadLinks.forEach(({ rel, href }) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Optimize images loading
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

    // Memory cleanup
    window.addEventListener('beforeunload', () => {
      if (scrollRAF) caf(scrollRAF);
      animationObserver.disconnect();
    });
  }

  // Enhanced initialization
  function initialize() {
    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Initialize scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    // Initialize accordions
    const solutions = document.getElementById('solutions');
    if (solutions) createPremiumAccordion(solutions);
    
    document.querySelectorAll('#faq .faq').forEach(createPremiumAccordion);

    // Initialize modal
    initializePremiumModal();

    // Initialize animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      if (['card', 'badge', 'highlight', 'tile'].includes(element.dataset.animate)) {
        animationObserver.observe(element);
      }
    });

    // Performance optimizations
    optimizePerformance();

    // Add loading complete class
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Enhanced resize handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate animations on resize
      const animatedElements = document.querySelectorAll('.animate-in');
      animatedElements.forEach(el => {
        el.style.transform = '';
        el.style.opacity = '';
        raf(() => {
          el.classList.remove('animate-in');
          setTimeout(() => {
            animationObserver.observe(el);
          }, 50);
        });
      });
    }, 150);
  }, { passive: true });

  // Debug mode (remove in production)
  if (window.location.search.includes('debug=true')) {
    window.FlowCoreDebug = {
      animationObserver,
      getAnimationDelay,
      createRipple
    };
    console.log('FlowCore Debug Mode Enabled');
  }

})();
