/**
 * Gallery Module
 * Handles masonry layout, category filtering, and image loading
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    animationDuration: 300
  };

  // State
  let currentFilter = 'all';
  let galleryItems = [];
  let videoItems = [];

  /**
   * Initialize gallery
   */
  function init() {
    initPhotoGallery();
    initVideoGallery();
  }

  /**
   * Initialize photo gallery with masonry and filtering
   */
  function initPhotoGallery() {
    const gallery = document.querySelector('.gallery');
    const filterContainer = document.querySelector('.gallery-filters');

    if (!gallery || typeof PHOTOS === 'undefined') return;

    // Render gallery items
    renderGallery();

    // Initialize filters
    if (filterContainer) {
      initFilters(filterContainer, 'photo');
    }
  }

  /**
   * Render gallery items from PHOTOS array
   */
  function renderGallery() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // Get featured items for homepage
    const isHomePage = !document.querySelector('.gallery-filters');
    const itemsToRender = isHomePage
      ? PHOTOS.filter(p => p.featured).slice(0, 3)
      : PHOTOS;

    const html = itemsToRender.map((photo, index) => {
      const title = photo.title || getFilenameFromPath(photo.src);
      // Store all categories in data attribute as JSON for filtering
      const categoriesAttr = JSON.stringify(photo.categories || []);
      // Display categories joined by "/"
      const categoriesDisplay = photo.categories ? photo.categories.join(' / ') : '';
      // Use first category for CSS/data attribute
      const primaryCategory = photo.categories && photo.categories.length > 0 ? photo.categories[0] : '';
      return `
        <div class="gallery__item" data-category="${primaryCategory}" data-categories='${categoriesAttr}' data-index="${index}">
          <div class="gallery__image-wrapper">
            <img
              src="${photo.src}"
              alt="${title}"
              class="gallery__image"
              loading="${index < 6 ? 'eager' : 'lazy'}"
              decoding="async"
              draggable="false"
            >
            <div class="gallery__overlay">
              <span class="gallery__category">${categoriesDisplay}</span>
              ${photo.title ? `<h3 class="gallery__title">${photo.title}</h3>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    gallery.innerHTML = html;

    // Store references for filtering
    galleryItems = Array.from(gallery.querySelectorAll('.gallery__item'));

    // Detect aspect ratios and set orientations after images load
    //detectImageOrientations(galleryItems);

    // Add click handlers for lightbox
    // Pass the actual photo object to ensure correct image opens when filtering
    galleryItems.forEach((item) => {
      const index = parseInt(item.dataset.index, 10);
      const photo = itemsToRender[index];
      item.addEventListener('click', () => {
        if (window.Lightbox) {
          window.Lightbox.open(photo, currentFilter);
        }
      });
    });

    // Prevent right-click and drag on gallery images
    const galleryImages = gallery.querySelectorAll('.gallery__image');
    galleryImages.forEach(img => {
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      img.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
    });
  }

  /**
   * Detect image aspect ratios and set orientation attributes
   * for proper masonry grid sizing
   */


  /**
   * Set orientation attribute based on aspect ratio
   */
  /**
   * Initialize video gallery
   */
  function initVideoGallery() {
    const videoGrid = document.querySelector('.video-grid');
    const filterContainer = document.querySelector('.video-filters');

    if (!videoGrid || typeof VIDEOS === 'undefined') return;

    // Render video items
    renderVideoGrid();

    // Initialize filters
    if (filterContainer) {
      initFilters(filterContainer, 'video');
    }
  }

  /**
   * Render video grid items from VIDEOS array
   */
  function renderVideoGrid() {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) return;

    const html = VIDEOS.map((video, index) => {
      return `
        <div class="video-card" data-category="${video.category}" data-index="${index}">
          <div class="video-card__thumb-wrapper">
            <img
              src="${video.thumb}"
              alt="${video.title}"
              class="video-card__thumb"
              loading="${index < 6 ? 'eager' : 'lazy'}"
              decoding="async"
            >
            <div class="video-card__play">
              <div class="video-card__play-icon"></div>
            </div>
            ${video.duration ? `<span class="video-card__duration">${video.duration}</span>` : ''}
          </div>
          <div class="video-card__info">
            <h3 class="video-card__title">${video.title}</h3>
            <span class="video-card__category">${video.category}</span>
          </div>
        </div>
      `;
    }).join('');

    videoGrid.innerHTML = html;

    // Store references for filtering
    videoItems = Array.from(videoGrid.querySelectorAll('.video-card'));

    // Add click handlers
    videoItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (window.VideoModal) {
          window.VideoModal.open(index);
        }
      });
    });
  }

  /**
   * Initialize filter tabs
   */
  function initFilters(container, type) {
    const tabs = container.querySelectorAll('.filter-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.filter;

        // Update active state
        tabs.forEach(t => t.classList.remove('filter-tab--active'));
        tab.classList.add('filter-tab--active');

        // Apply filter
        if (type === 'photo') {
          filterGallery(category);
        } else {
          filterVideos(category);
        }

        currentFilter = category;
      });
    });
  }

  /**
   * Filter gallery items
   */
  function filterGallery(category) {
    galleryItems.forEach(item => {
      // Parse categories array from data attribute
      let itemCategories = [];
      try {
        itemCategories = JSON.parse(item.dataset.categories || '[]');
      } catch (e) {
        // Fallback to single category for backward compatibility
        itemCategories = [item.dataset.category];
      }
      // Check if photo has the selected category in its categories array
      const shouldShow = category === 'all' || itemCategories.includes(category);

      if (shouldShow) {
        item.classList.remove('gallery__item--hidden');
        item.style.display = '';
      } else {
        item.classList.add('gallery__item--hidden');
        item.style.display = 'none';
      }
    });

    // Update lightbox filtered indices
    if (window.Lightbox) {
      window.Lightbox.updateFilteredIndices(category);
    }
  }

  /**
   * Filter video items
   */
  function filterVideos(category) {
    videoItems.forEach(item => {
      const itemCategory = item.dataset.category;
      const shouldShow = category === 'all' || itemCategory === category;

      if (shouldShow) {
        item.classList.remove('video-card--hidden');
        item.style.display = '';
      } else {
        item.classList.add('video-card--hidden');
        item.style.display = 'none';
      }
    });
  }

  /**
   * Extract filename from path
   */
  function getFilenameFromPath(path) {
    return path.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
  }

  /**
   * Get current filtered photos
   */
  function getFilteredPhotos(filter = 'all') {
    if (filter === 'all') return PHOTOS;
    return PHOTOS.filter(p => p.categories && p.categories.includes(filter));
  }

  /**
   * Get current filtered videos
   */
  function getFilteredVideos(filter = 'all') {
    if (filter === 'all') return VIDEOS;
    return VIDEOS.filter(v => v.category === filter);
  }

  /**
   * Public API
   */
  window.Gallery = {
    init,
    filterGallery,
    filterVideos,
    getFilteredPhotos,
    getFilteredVideos,
    get currentFilter() { return currentFilter; }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
