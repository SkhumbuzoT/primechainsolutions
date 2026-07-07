/**
 * PrimeChain Solutions — Main JavaScript
 * Handles: scroll progress, mobile nav, reveal animations
 */

(function() {
  'use strict';

  // DOM elements
  const sp = document.getElementById('sp');
  const nav = document.getElementById('nav');
  const mobBtn = document.getElementById('mobBtn');
  const navLinks = document.getElementById('navLinks');

  /**
   * Scroll Progress Bar
   * Updates width as user scrolls down page
   */
  function updateScrollProgress() {
    if (!sp) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    sp.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }

  /**
   * Scroll-dependent nav styling
   * Adds blur & shadow when user scrolls past hero
   */
  function updateNavOnScroll() {
    const hasScrolled = window.scrollY > 60;
    nav.classList.toggle('scrolled', hasScrolled);
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    if (!mobBtn || !navLinks) return;

    mobBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobBtn.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when any nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  /**
   * Reveal animations on scroll
   * Uses Intersection Observer to trigger animations
   * when elements enter viewport
   */
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const options = {
      threshold: 0.07,
      rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    revealElements.forEach(el => observer.observe(el));
  }

  /**
   * Scroll event handler with passive flag for performance
   */
  window.addEventListener(
    'scroll',
    () => {
      updateScrollProgress();
      updateNavOnScroll();
    },
    { passive: true }
  );

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initRevealAnimations();
  });

})();
