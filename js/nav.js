/**
 * Navigation Module
 * Handles navbar scroll effects, mobile menu, smooth scrolling, active links
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    scrollThreshold: 50,
    scrollOffset: 80 // navbar height
  };

  // State
  let isMobileMenuOpen = false;
  let lastScrollY = 0;

  /**
   * Initialize navigation
   */
  function init() {
    initScrollEffects();
    initMobileMenu();
    initSmoothScroll();
    initActiveLink();
    initBackToTop();
  }

  /**
   * Navbar scroll effects (backdrop blur, shrink)
   */
  function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const filterTabs = document.querySelector('.filter-tabs');

    if (!navbar) return;

    function handleScroll() {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > CONFIG.scrollThreshold;

      // Toggle scrolled class on navbar
      navbar.classList.toggle('navbar--scrolled', isScrolled);

      // Update filter tabs sticky position
      if (filterTabs) {
        filterTabs.classList.toggle('filter-tabs--scrolled', isScrolled);
      }

      lastScrollY = scrollY;
    }

    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.navbar__mobile-menu');

    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;

      hamburger.classList.toggle('navbar__hamburger--active', isMobileMenuOpen);
      hamburger.setAttribute('aria-expanded', isMobileMenuOpen);
      mobileMenu.classList.toggle('navbar__mobile-menu--open', isMobileMenuOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      if (isMobileMenuOpen) {
        isMobileMenuOpen = false;
        hamburger.classList.remove('navbar__hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('navbar__mobile-menu--open');
        document.body.style.overflow = '';
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('.navbar__mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || CONFIG.scrollOffset;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Highlight active nav link based on current page
   */
  function initActiveLink() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    // Desktop links
    const navLinks = document.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.split('/').pop() || 'index.html';
        if (linkPage === pageName ||
            (pageName === '' && linkPage === 'index.html') ||
            (pageName === 'index.html' && linkPage === 'index.html')) {
          link.classList.add('navbar__link--active');
        }
      }
    });

    // Mobile links
    const mobileLinks = document.querySelectorAll('.navbar__mobile-link');
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.split('/').pop() || 'index.html';
        if (linkPage === pageName ||
            (pageName === '' && linkPage === 'index.html') ||
            (pageName === 'index.html' && linkPage === 'index.html')) {
          link.classList.add('navbar__mobile-link--active');
        }
      }
    });
  }

  /**
   * Back to top button
   */
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    function toggleVisibility() {
      const show = window.scrollY > window.innerHeight;
      backToTop.classList.toggle('back-to-top--visible', show);
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Initial check
    toggleVisibility();
  }

  /**
   * Intersection Observer for fade-in animations
   */
  function initFadeInObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('DOMContentLoaded', initFadeInObserver);
  } else {
    init();
    initFadeInObserver();
  }

  // Re-init fade observer after page load
  window.addEventListener('load', initFadeInObserver);
})();
