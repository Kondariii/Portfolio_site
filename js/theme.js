/**
 * Theme System
 * Handles dark/light mode and color palette switching
 * Persists preferences to localStorage
 * Applies theme immediately to prevent flash
 */

(function() {
  'use strict';

  // Theme configuration
  const CONFIG = {
    storageKey: 'portfolio-theme',
    defaultTheme: 'dark',
    defaultPalette: 'purple',
    availablePalettes: ['purple', 'orange', 'gray', 'teal', 'rose', 'amber']
  };

  // State
  let currentTheme = CONFIG.defaultTheme;
  let currentPalette = CONFIG.defaultPalette;
  let isMenuOpen = false;

  /**
   * Initialize theme immediately (called in head to prevent flash)
   */
  function initTheme() {
    const saved = loadTheme();
    currentTheme = saved.theme || CONFIG.defaultTheme;
    currentPalette = saved.palette || CONFIG.defaultPalette;

    // Apply immediately
    applyTheme(currentTheme, currentPalette);

    // Mark body as loaded for fade-in
    document.documentElement.classList.add('theme-initialized');
  }

  /**
   * Apply theme classes to html element
   */
  function applyTheme(theme, palette) {
    const html = document.documentElement;

    // Remove existing theme classes
    html.classList.remove('theme-dark', 'theme-light');
    CONFIG.availablePalettes.forEach(p => {
      html.classList.remove(`palette-${p}`);
    });

    // Add new theme classes
    html.classList.add(`theme-${theme}`);
    html.classList.add(`palette-${palette}`);

    // Update CSS custom properties for RGB values (for alpha blending)
    updateRgbVariables(theme, palette);

    // Store current values
    currentTheme = theme;
    currentPalette = palette;
  }

  /**
   * Update RGB versions of colors for alpha blending
   */
  function updateRgbVariables(theme, palette) {
    const root = document.documentElement;
    const paletteColors = getPaletteColors(palette, theme);

    // Set RGB values for background (for backdrop-filter support)
    const bgRgb = hexToRgb(getBackgroundColor(theme));
    if (bgRgb) {
      root.style.setProperty('--bg-primary-rgb', `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`);
    }

    // Set RGB for accent
    const accentRgb = hexToRgb(paletteColors.primary);
    if (accentRgb) {
      root.style.setProperty('--accent-primary-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
    }
  }

  /**
   * Get colors for a palette
   */
  function getPaletteColors(palette, theme) {
    const colors = {
      purple: { primary: '#a855f7', dark: '#7c3aed' },
      orange: { primary: '#f97316', dark: '#ea580c' },
      gray: { primary: '#6b7280', dark: '#4b5563' },
      teal: { primary: '#14b8a6', dark: '#0d9488' },
      rose: { primary: '#ec4899', dark: '#db2777' },
      amber: { primary: '#f59e0b', dark: '#d97706' }
    };

    return colors[palette] || colors.purple;
  }

  /**
   * Get background color for theme
   */
  function getBackgroundColor(theme) {
    return theme === 'dark' ? '#0a0a0a' : '#fafafa';
  }

  /**
   * Convert hex to RGB object
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Save theme to localStorage
   */
  function saveTheme(theme, palette) {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify({ theme, palette }));
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  /**
   * Load theme from localStorage
   */
  function loadTheme() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Could not load theme preference:', e);
      return {};
    }
  }

  /**
   * Set theme (dark/light)
   */
  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    applyTheme(theme, currentPalette);
    saveTheme(theme, currentPalette);
    updateUI();
  }

  /**
   * Set color palette
   */
  function setPalette(palette) {
    if (!CONFIG.availablePalettes.includes(palette)) return;
    applyTheme(currentTheme, palette);
    saveTheme(currentTheme, palette);
    updateUI();
  }

  /**
   * Toggle between dark and light
   */
  function toggleTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  /**
   * Toggle theme panel menu
   */
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    updateUI();
  }

  /**
   * Close menu
   */
  function closeMenu() {
    isMenuOpen = false;
    updateUI();
  }

  /**
   * Update UI elements to match current theme
   */
  function updateUI() {
    const panel = document.querySelector('.theme-panel');
    if (!panel) return;

    const toggle = panel.querySelector('.theme-panel__toggle');
    const menu = panel.querySelector('.theme-panel__menu');
    const backdrop = panel.querySelector('.theme-panel__backdrop');

    // Toggle button state
    if (toggle) {
      toggle.classList.toggle('theme-panel__toggle--active', isMenuOpen);
      toggle.setAttribute('aria-expanded', isMenuOpen);
    }

    // Update language buttons when panel opens
    if (isMenuOpen && window.I18n) {
      window.I18n.updateUI();
    }

    // Menu visibility
    if (menu) {
      menu.classList.toggle('theme-panel__menu--open', isMenuOpen);
    }

    // Backdrop visibility
    if (backdrop) {
      backdrop.classList.toggle('theme-panel__backdrop--visible', isMenuOpen);
    }

    // Update mode buttons
    const modeBtns = panel.querySelectorAll('.theme-panel__mode-btn');
    modeBtns.forEach(btn => {
      const isActive = btn.dataset.mode === currentTheme;
      btn.classList.toggle('theme-panel__mode-btn--active', isActive);
    });

    // Update palette buttons
    const paletteBtns = panel.querySelectorAll('.theme-panel__palette-btn');
    paletteBtns.forEach(btn => {
      const isActive = btn.dataset.palette === currentPalette;
      btn.classList.toggle('theme-panel__palette-btn--active', isActive);
    });
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    const panel = document.querySelector('.theme-panel');
    if (!panel) return;

    const toggle = panel.querySelector('.theme-panel__toggle');
    const menu = panel.querySelector('.theme-panel__menu');
    const backdrop = panel.querySelector('.theme-panel__backdrop');

    // Toggle button - open/close menu
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    // Close on backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    // Prevent clicks inside menu from closing it
    if (menu) {
      menu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Mode buttons
    const modeBtns = panel.querySelectorAll('.theme-panel__mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setTheme(btn.dataset.mode);
      });
    });

    // Palette buttons
    const paletteBtns = panel.querySelectorAll('.theme-panel__palette-btn');
    paletteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPalette(btn.dataset.palette);
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });

    // Close on click outside (only when clicking on document, not inside panel)
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !panel.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /**
   * Public API
   */
  window.ThemeSystem = {
    init: initTheme,
    initUI: initEventListeners,
    setTheme,
    setPalette,
    toggleTheme,
    getCurrentTheme: () => ({ theme: currentTheme, palette: currentPalette })
  };

  // Initialize immediately (for no-flash)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initEventListeners();
    });
  } else {
    initTheme();
    initEventListeners();
  }
})();
