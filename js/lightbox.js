/**
 * Lightbox Module
 * Fullscreen image viewer with navigation, keyboard support, and swipe gestures
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    animationDuration: 300,
    swipeThreshold: 50
  };

  // State
  let isOpen = false;
  let currentIndex = 0;
  let currentFilter = 'all';
  let filteredPhotos = [];
  let touchStartX = 0;
  let touchStartY = 0;

  // DOM Elements
  let lightbox = null;
  let lightboxImage = null;
  let lightboxTitle = null;
  let lightboxMeta = null;
  let lightboxCounter = null;

  /**
   * Initialize lightbox
   */
  function init() {
    createLightboxStructure();
    cacheElements();
    initEventListeners();
  }

  /**
   * Create lightbox HTML structure
   */
  function createLightboxStructure() {
    // Check if already exists
    if (document.querySelector('.lightbox')) return;

    const html = `
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
        <div class="lightbox__backdrop"></div>
        <button class="lightbox__close" aria-label="Close lightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <span class="lightbox__counter"></span>
        <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">
          <svg class="lightbox__nav-icon" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">
          <svg class="lightbox__nav-icon" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <div class="lightbox__content">
          <div class="lightbox__image-wrapper">
            <img class="lightbox__image" src="" alt="">
          </div>
          <div class="lightbox__info">
            <h3 class="lightbox__title"></h3>
            <p class="lightbox__meta"></p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  /**
   * Cache DOM element references
   */
  function cacheElements() {
    lightbox = document.querySelector('.lightbox');
    lightboxImage = document.querySelector('.lightbox__image');
    lightboxTitle = document.querySelector('.lightbox__title');
    lightboxMeta = document.querySelector('.lightbox__meta');
    lightboxCounter = document.querySelector('.lightbox__counter');
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    if (!lightbox) return;

    // Close button
    const closeBtn = lightbox.querySelector('.lightbox__close');
    closeBtn?.addEventListener('click', close);

    // Backdrop click
    const backdrop = lightbox.querySelector('.lightbox__backdrop');
    backdrop?.addEventListener('click', close);

    // Navigation
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(-1);
    });

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    // Touch/swipe support
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /**
   * Open lightbox at specific index
   */
  function open(index, filter = 'all') {
    if (typeof PHOTOS === 'undefined') return;

    currentFilter = filter;
    filteredPhotos = filter === 'all'
      ? [...PHOTOS]
      : PHOTOS.filter(p => p.category === filter);

    // Find the actual index in filtered array
    const photo = PHOTOS[index];
    currentIndex = filteredPhotos.findIndex(p => p.src === photo.src);
    if (currentIndex === -1) currentIndex = 0;

    isOpen = true;

    // Show lightbox
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';

    // Load image
    loadImage(currentIndex);
  }

  /**
   * Close lightbox
   */
  function close() {
    if (!isOpen) return;

    isOpen = false;
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';

    // Clear image after transition
    setTimeout(() => {
      if (!isOpen) {
        lightboxImage.src = '';
      }
    }, CONFIG.animationDuration);
  }

  /**
   * Navigate to previous/next image
   */
  function navigate(direction) {
    const newIndex = currentIndex + direction;

    if (newIndex < 0 || newIndex >= filteredPhotos.length) return;

    currentIndex = newIndex;
    loadImage(currentIndex);
  }

  /**
   * Load and display image at index
   */
  function loadImage(index) {
    const photo = filteredPhotos[index];
    if (!photo) return;

    const title = photo.title || getFilenameFromPath(photo.src);

    // Update counter
    lightboxCounter.textContent = `${index + 1} / ${filteredPhotos.length}`;

    // Animate out current image
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.95)';

    // Load new image
    const img = new Image();
    img.onload = () => {
      lightboxImage.src = photo.src;
      lightboxImage.alt = title;

      // Update info
      lightboxTitle.textContent = title;
      lightboxMeta.textContent = `${photo.category} • ${getFilenameFromPath(photo.src)}`;

      // Animate in
      requestAnimationFrame(() => {
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
      });
    };
    img.src = photo.src;

    // Update navigation button visibility
    updateNavButtons();
  }

  /**
   * Update navigation button visibility
   */
  function updateNavButtons() {
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');

    if (prevBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    }

    if (nextBtn) {
      nextBtn.style.opacity = currentIndex === filteredPhotos.length - 1 ? '0.3' : '1';
      nextBtn.style.pointerEvents = currentIndex === filteredPhotos.length - 1 ? 'none' : 'auto';
    }
  }

  /**
   * Handle keyboard events
   */
  function handleKeydown(e) {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        navigate(-1);
        break;
      case 'ArrowRight':
        navigate(1);
        break;
    }
  }

  /**
   * Handle touch start for swipe
   */
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  /**
   * Handle touch end for swipe
   */
  function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > CONFIG.swipeThreshold) {
        if (diffX > 0) {
          navigate(1); // Swipe left = next
        } else {
          navigate(-1); // Swipe right = previous
        }
      }
    }

    touchStartX = 0;
    touchStartY = 0;
  }

  /**
   * Update filtered indices when filter changes
   */
  function updateFilteredIndices(filter) {
    currentFilter = filter;
    filteredPhotos = filter === 'all'
      ? [...PHOTOS]
      : PHOTOS.filter(p => p.category === filter);
  }

  /**
   * Extract filename from path
   */
  function getFilenameFromPath(path) {
    return path.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
  }

  /**
   * Public API
   */
  window.Lightbox = {
    init,
    open,
    close,
    navigate,
    updateFilteredIndices
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
