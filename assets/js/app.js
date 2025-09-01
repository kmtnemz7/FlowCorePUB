// FlowCore site JavaScript
(function() {
  'use strict';

  // Smooth scroll for anchor links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    
    // Close mobile menu if open
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle && menuToggle.checked) {
      menuToggle.checked = false;
    }
    
    // Smooth scroll to target
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  }
  
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Initial call

  // Accordion functionality for solution tiles
  function initAccordions() {
    const containers = document.querySelectorAll('#solutions');
    
    containers.forEach(container => {
      const details = Array.from(container.querySelectorAll('details'));
      
      details.forEach(detail => {
        detail.addEventListener('toggle', function() {
          if (this.open) {
            // Close other details in the same container
            details.forEach(other => {
              if (other !== this && other.open) {
                other.open = false;
              }
            });
          }
        });
        
        // Enhanced keyboard support
        const summary = detail.querySelector('summary');
        if (summary) {
          summary.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              detail.open = !detail.open;
            }
          });
        }
      });
    });
  }

  // Form validation and submission
  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector('#form-success');
    const errorMessage = form.querySelector('#form-error');
    
    // Validation functions
    function showError(field, message) {
      const errorElement = document.getElementById(field.id + '-error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
      }
      field.classList.add('error');
    }
    
    function clearError(field) {
      const errorElement = document.getElementById(field.id + '-error');
      if (errorElement) {
        errorElement.classList.remove('show');
      }
      field.classList.remove('error');
    }
    
    function validateField(field) {
      clearError(field);
      
      if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, 'This field is required');
        return false;
      }
      
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          showError(field, 'Please enter a valid email address');
          return false;
        }
      }
      
      return true;
    }
    
    // Real-time validation
    [nameField, emailField, messageField].forEach(field => {
      if (field) {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) {
            validateField(field);
          }
        });
      }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate all fields
      const isValid = [nameField, emailField, messageField]
        .filter(field => field)
        .every(field => validateField(field));
      
      if (!isValid) {
        return;
      }
      
      // Show loading state
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      // Hide previous messages
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      
      try {
        // TODO: Replace with actual form submission
        // This is a placeholder - you'll need to configure your form endpoint
        const formData = new FormData(form);
        
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, just show success (replace with actual fetch call)
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success
          successMessage.style.display = 'block';
          form.reset();
          
          // Scroll to success message
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Network response was not ok');
        }
        
      } catch (error) {
        console.error('Form submission error:', error);
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Intersection Observer for animations
  function initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .tile, .testimonial, .price-card');
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }

  // External link security
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
      link.setAttribute('rel', 'noopener noreferrer');
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });
  }

  // Set current year in footer
  function updateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }

  // Focus management for mobile menu
  function initMobileMenuFocus() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuToggle || !menu) return;
    
    menuToggle.addEventListener('change', function() {
      if (this.checked) {
        // Menu opened - focus first link
        const firstLink = menu.querySelector('a');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuToggle.checked) {
        menuToggle.checked = false;
        menuToggle.focus();
      }
    });
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalImages = [
      'assets/img/icon.png',
      'assets/img/icon-192.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Log Core Web Vitals if available
    if ('web-vital' in window) {
      return; // Would implement web-vitals library integration here
    }
    
    // Basic performance logging
    window.addEventListener('load', function() {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData && perfData.loadEventEnd - perfData.navigationStart > 3000) {
          console.warn('Page load time exceeds 3 seconds:', perfData.loadEventEnd - perfData.navigationStart);
        }
      }
    });
  }

  // Error handling
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Don't let JavaScript errors break the user experience
    // Could implement error reporting here
  });

  // Initialize everything when DOM is ready
  function init() {
    initAccordions();
    initContactForm();
    initAnimations();
    initExternalLinks();
    initMobileMenuFocus();
    updateFooterYear();
    preloadCriticalResources();
    initPerformanceMonitoring();
  }

  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // CSS animation class (add to CSS if you want fade-in effects)
  const style = document.createElement('style');
  style.textContent = `
    .card, .tile, .testimonial, .price-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .form-group input.error,
    .form-group textarea.error {
      border-color: var(--error);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .card, .tile, .testimonial, .price-card {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);

})();
