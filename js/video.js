/**
 * Video Modal Module
 * Handles video playback in modal - supports local files and embeds (YouTube/Vimeo)
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    animationDuration: 300
  };

  // State
  let isOpen = false;
  let currentPlayer = null;

  // DOM Elements
  let modal = null;
  let modalContent = null;

  /**
   * Initialize video modal
   */
  function init() {
    createModalStructure();
    cacheElements();
    initEventListeners();
  }

  /**
   * Create modal HTML structure
   */
  function createModalStructure() {
    // Check if already exists
    if (document.querySelector('.video-modal')) return;

    const html = `
      <div class="video-modal" role="dialog" aria-modal="true" aria-label="Video player">
        <div class="video-modal__backdrop"></div>
        <div class="video-modal__content">
          <button class="video-modal__close" aria-label="Close video">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="video-modal__player-container"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  /**
   * Cache DOM element references
   */
  function cacheElements() {
    modal = document.querySelector('.video-modal');
    modalContent = document.querySelector('.video-modal__player-container');
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    if (!modal) return;

    // Close button
    const closeBtn = modal.querySelector('.video-modal__close');
    closeBtn?.addEventListener('click', close);

    // Backdrop click
    const backdrop = modal.querySelector('.video-modal__backdrop');
    backdrop?.addEventListener('click', close);

    // Keyboard
    document.addEventListener('keydown', handleKeydown);
  }

  /**
   * Open video modal
   */
  function open(index) {
    if (typeof VIDEOS === 'undefined' || !VIDEOS[index]) return;

    const video = VIDEOS[index];
    isOpen = true;

    // Show modal
    modal.classList.add('video-modal--open');
    document.body.style.overflow = 'hidden';

    // Load video
    loadVideo(video);
  }

  /**
   * Close video modal
   */
  function close() {
    if (!isOpen) return;

    isOpen = false;
    modal.classList.remove('video-modal--open');
    document.body.style.overflow = '';

    // Stop and cleanup player
    setTimeout(() => {
      if (modalContent) {
        modalContent.innerHTML = '';
      }
      currentPlayer = null;
    }, CONFIG.animationDuration);
  }

  /**
   * Load video into modal
   */
  function loadVideo(video) {
    if (!modalContent) return;

    const videoType = detectVideoType(video.src);
    let playerHtml = '';

    switch (videoType) {
      case 'youtube':
        playerHtml = createYouTubeEmbed(video.src);
        break;
      case 'vimeo':
        playerHtml = createVimeoEmbed(video.src);
        break;
      case 'local':
      default:
        playerHtml = createLocalVideoPlayer(video.src);
        break;
    }

    modalContent.innerHTML = playerHtml;
  }

  /**
   * Detect video type from URL
   */
  function detectVideoType(url) {
    if (!url) return 'local';

    // YouTube patterns
    const youtubePatterns = [
      /youtube\.com\/watch\?v=([\w-]+)/,
      /youtu\.be\/([\w-]+)/,
      /youtube\.com\/embed\/([\w-]+)/
    ];

    for (const pattern of youtubePatterns) {
      if (pattern.test(url)) return 'youtube';
    }

    // Vimeo patterns
    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ];

    for (const pattern of vimeoPatterns) {
      if (pattern.test(url)) return 'vimeo';
    }

    // Local file extensions
    const localExtensions = ['.mp4', '.webm', '.mov', '.mkv', '.avi'];
    const hasLocalExtension = localExtensions.some(ext =>
      url.toLowerCase().endsWith(ext)
    );

    if (hasLocalExtension || !url.includes('http')) {
      return 'local';
    }

    return 'local';
  }

  /**
   * Create YouTube embed HTML
   */
  function createYouTubeEmbed(url) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return '';

    return `
      <iframe
        class="video-modal__player"
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
  }

  /**
   * Create Vimeo embed HTML
   */
  function createVimeoEmbed(url) {
    const videoId = extractVimeoId(url);
    if (!videoId) return '';

    return `
      <iframe
        class="video-modal__player"
        src="https://player.vimeo.com/video/${videoId}?autoplay=1"
        title="Vimeo video player"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
  }

  /**
   * Create local video player HTML
   */
  function createLocalVideoPlayer(src) {
    return `
      <video
        class="video-modal__video"
        controls
        autoplay
        playsinline
      >
        <source src="${src}" type="video/mp4">
        <source src="${src.replace('.mp4', '.webm')}" type="video/webm">
        Your browser does not support the video tag.
      </video>
    `;
  }

  /**
   * Extract YouTube video ID from URL
   */
  function extractYouTubeId(url) {
    const patterns = [
      /youtube\.com\/watch\?v=([\w-]+)/,
      /youtu\.be\/([\w-]+)/,
      /youtube\.com\/embed\/([\w-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Extract Vimeo video ID from URL
   */
  function extractVimeoId(url) {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Handle keyboard events
   */
  function handleKeydown(e) {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      close();
    }
  }

  /**
   * Public API
   */
  window.VideoModal = {
    init,
    open,
    close
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
