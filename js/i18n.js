/**
 * Internationalization (i18n) Module
 * Supports English (en) and Polish (pl)
 * Persists language preference to localStorage
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'portfolio-language',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'pl']
  };

  // Translations
  const TRANSLATIONS = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.photography': 'Photography',
      'nav.videography': 'Videography',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.close': 'Close',

      // Hero
      'hero.tagline': 'Photography & Videography',
      'hero.cta.photography': 'View Photography',
      'hero.cta.videography': 'View Films',
      'hero.scroll': 'Scroll to content',

      // Featured Section
      'featured.caption': 'Featured Work',
      'featured.title': 'Selected Projects',
      'featured.cta': 'View All Photography',

      // Services
      'services.caption': 'Services',
      'services.title': 'What I Do',
      'services.photography.title': 'Photography',
      'services.photography.desc': 'Street, portrait, landscape, and architectural photography that captures authentic moments and timeless beauty.',
      'services.photography.link': 'Explore Portfolio →',
      'services.videography.title': 'Videography',
      'services.videography.desc': 'Cinematic films, documentaries, event coverage, and music videos with compelling storytelling.',
      'services.videography.link': 'Watch Reel →',
      'services.creative.title': 'Creative Direction',
      'services.creative.desc': 'Full-service creative direction for brands, agencies, and artistic projects from concept to delivery.',
      'services.creative.link': 'Get in Touch →',

      // Page Headers
      'page.photography.title': 'Photography',
      'page.photography.subtitle': 'Capturing moments, preserving memories, telling stories through light and shadow.',
      'page.videography.title': 'Videography',
      'page.videography.subtitle': 'Cinematic storytelling through motion, sound, and emotion.',
      'page.about.title': 'About',
      'page.about.subtitle': 'Visual storyteller passionate about capturing authentic moments.',
      'page.contact.title': 'Contact',
      'page.contact.subtitle': 'Let\'s create something beautiful together.',

      // Portfolio
      'portfolio.caption': 'Portfolio',

      // Categories
      'category.all': 'All',
      'category.street': 'Street',
      'category.portrait': 'Portrait',
      'category.landscape': 'Landscape',
      'category.architecture': 'Architecture',
      'category.nature': 'Nature',
      'category.product': 'Product',
      'category.cars': 'Cars',

      // About Page
      'about.caption': 'About Me',
      'about.title': 'Jakub Krzemiński',
      'about.role': 'Photographer & Filmmaker',
      'about.bio': 'I am a visual storyteller based in Poland, passionate about capturing authentic moments and creating compelling visual narratives. My work spans street photography, intimate portraits, sweeping landscapes, and cinematic films.',
      'about.approach.title': 'My Approach',
      'about.approach.text': 'I believe every image should tell a story. Whether I\'m documenting the raw energy of city streets, capturing the essence of a person, or crafting a cinematic sequence, I seek to find beauty in authenticity and meaning in the fleeting moments.',
      'about.experience.title': 'Experience',
      'about.experience.text': 'With years of experience in both photography and videography, I\'ve had the privilege of working with diverse clients ranging from individual portraits to brand campaigns and documentary projects.',
      'about.stats.clients': 'Happy Clients',
      'about.stats.projects': 'Projects Completed',
      'about.stats.years': 'Years Experience',

      // Contact Page
      'contact.caption': 'Get in Touch',
      'contact.title': 'Let\'s Work Together',
      'contact.description': 'Have a project in mind? I\'d love to hear about it. Fill out the form below or reach out through my social channels.',
      'contact.form.name': 'Your Name',
      'contact.form.email': 'Email Address',
      'contact.form.subject': 'Subject',
      'contact.form.message': 'Your Message',
      'contact.form.send': 'Send Message',
      'contact.form.sending': 'Sending...',
      'contact.form.success': 'Message sent successfully!',
      'contact.form.error': 'Something went wrong. Please try again.',
      'contact.info.email.title': 'Email',
      'contact.info.social.title': 'Follow Me',
      'contact.info.location.title': 'Location',
      'contact.info.location.value': 'Poland',

      // Footer
      'footer.copyright': '© 2026 Jakub Krzemiński. All rights reserved.',
      'footer.backToTop': 'Back to top',

      // Theme Panel
      'theme.appearance': 'Appearance Settings',
      'theme.dark': 'Dark',
      'theme.light': 'Light',
      'theme.palette': 'Color Palette',

      // Language
      'language.title': 'Language',
      'language.en': 'English',
      'language.pl': 'Polski'
    },

    pl: {
      // Navigation
      'nav.home': 'Strona Główna',
      'nav.photography': 'Fotografia',
      'nav.videography': 'Filmowanie',
      'nav.about': 'O Mnie',
      'nav.contact': 'Kontakt',
      'nav.close': 'Zamknij',

      // Hero
      'hero.tagline': 'Fotografia i Filmowanie',
      'hero.cta.photography': 'Zobacz Fotografie',
      'hero.cta.videography': 'Zobacz Filmy',
      'hero.scroll': 'Przewiń do treści',

      // Featured Section
      'featured.caption': 'Wyróżnione Prace',
      'featured.title': 'Wybrane Projekty',
      'featured.cta': 'Zobacz Wszystkie Fotografie',

      // Services
      'services.caption': 'Usługi',
      'services.title': 'Co Robię',
      'services.photography.title': 'Fotografia',
      'services.photography.desc': 'Fotografia uliczna, portretowa, krajobrazowa i architektoniczna, która uchwyca autentyczne momenty i ponadczasowe piękno.',
      'services.photography.link': 'Przeglądaj Portfolio →',
      'services.videography.title': 'Filmowanie',
      'services.videography.desc': 'Filmowe produkcje, dokumenty, relacje z wydarzeń i teledyski z fascynującą narracją.',
      'services.videography.link': 'Obejrzyj Reel →',
      'services.creative.title': 'Kierownictwo Kreatywne',
      'services.creative.desc': 'Pełna obsługa kreatywna dla marek, agencji i projektów artystycznych od koncepcji do realizacji.',
      'services.creative.link': 'Skontaktuj Się →',

      // Page Headers
      'page.photography.title': 'Fotografia',
      'page.photography.subtitle': 'Uchwycanie chwil, zachowywanie wspomnień, opowiadanie historii poprzez światło i cień.',
      'page.videography.title': 'Filmowanie',
      'page.videography.subtitle': 'Filmowe opowieści poprzez ruch, dźwięk i emocje.',
      'page.about.title': 'O Mnie',
      'page.about.subtitle': 'Opowiadacz historii wizualnych, pasjonujący się uchwycaniem autentycznych momentów.',
      'page.contact.title': 'Kontakt',
      'page.contact.subtitle': 'Stwórzmy razem coś pięknego.',

      // Portfolio
      'portfolio.caption': 'Portfolio',

      // Categories
      'category.all': 'Wszystkie',
      'category.street': 'Ulica',
      'category.portrait': 'Portret',
      'category.landscape': 'Krajobraz',
      'category.architecture': 'Architektura',
      'category.nature': 'Natura',
      'category.product': 'Produkt',
      'category.cars': 'Samochody',

      // About Page
      'about.caption': 'O Mnie',
      'about.title': 'Jakub Krzemiński',
      'about.role': 'Fotograf i Filmowiec',
      'about.bio': 'Jestem opowiadaczem historii wizualnych z Polski, pasjonującym się uchwycaniem autentycznych momentów i tworzeniem fascynujących narracji wizualnych. Moja praca obejmuje fotografię uliczną, intymne portrety, rozległe krajobrazy i filmowe produkcje.',
      'about.approach.title': 'Moje Podejście',
      'about.approach.text': 'Wierzę, że każde zdjęcie powinno opowiadać historię. Niezależnie od tego, czy dokumentuję surową energię ulic miasta, uchwycam istotę człowieka, czy tworzę filmową sekwencję, dążę do znalezienia piękna w autentyczności i znaczenia w ulotnych momentach.',
      'about.experience.title': 'Doświadczenie',
      'about.experience.text': 'Dzięki wieloletniemu doświadczeniu zarówno w fotografii, jak i filmowaniu, miałem przywilej pracy z różnorodnymi klientami - od indywidualnych portretów po kampanie markowe i projekty dokumentalne.',
      'about.stats.clients': 'Zadowolonych Klientów',
      'about.stats.projects': 'Ukończonych Projektów',
      'about.stats.years': 'Lat Doświadczenia',

      // Contact Page
      'contact.caption': 'Skontaktuj Się',
      'contact.title': 'Pracujmy Razem',
      'contact.description': 'Masz projekt w głowie? Chętnie o nim usłyszę. Wypełnij poniższy formularz lub skontaktuj się poprzez moje kanały społecznościowe.',
      'contact.form.name': 'Twoje Imię',
      'contact.form.email': 'Adres Email',
      'contact.form.subject': 'Temat',
      'contact.form.message': 'Twoja Wiadomość',
      'contact.form.send': 'Wyślij Wiadomość',
      'contact.form.sending': 'Wysyłanie...',
      'contact.form.success': 'Wiadomość wysłana pomyślnie!',
      'contact.form.error': 'Coś poszło nie tak. Spróbuj ponownie.',
      'contact.info.email.title': 'Email',
      'contact.info.social.title': 'Obserwuj Mnie',
      'contact.info.location.title': 'Lokalizacja',
      'contact.info.location.value': 'Polska',

      // Footer
      'footer.copyright': '© 2026 Jakub Krzemiński. Wszelkie prawa zastrzeżone.',
      'footer.backToTop': 'Powrót do góry',

      // Theme Panel
      'theme.appearance': 'Ustawienia Wyglądu',
      'theme.dark': 'Ciemny',
      'theme.light': 'Jasny',
      'theme.palette': 'Paleta Kolorów',

      // Language
      'language.title': 'Język',
      'language.en': 'English',
      'language.pl': 'Polski'
    }
  };

  // State
  let currentLanguage = CONFIG.defaultLanguage;

  /**
   * Initialize language immediately (called in head to prevent flash)
   */
  function initLanguage() {
    const saved = loadLanguage();
    currentLanguage = saved || CONFIG.defaultLanguage;

    // Apply immediately
    applyLanguage(currentLanguage);

    // Mark html with language attribute
    document.documentElement.lang = currentLanguage;
  }

  /**
   * Apply language to the page
   */
  function applyLanguage(lang) {
    if (!CONFIG.availableLanguages.includes(lang)) return;

    currentLanguage = lang;
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    updatePageTranslations();
  }

  /**
   * Update translations on the current page
   */
  function updatePageTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.dataset.i18n;
      const translation = translate(key);
      if (translation) {
        // Check if element has input/textarea
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.placeholder = translation;
          }
        } else {
          el.textContent = translation;
        }
      }
    });

    // Update aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(el => {
      const key = el.dataset.i18nAria;
      const translation = translate(key);
      if (translation) {
        el.setAttribute('aria-label', translation);
      }
    });
  }

  /**
   * Get translation for a key
   */
  function translate(key) {
    const translations = TRANSLATIONS[currentLanguage];
    if (!translations) return key;
    return translations[key] || TRANSLATIONS[CONFIG.defaultLanguage][key] || key;
  }

  /**
   * Save language to localStorage
   */
  function saveLanguage(lang) {
    try {
      localStorage.setItem(CONFIG.storageKey, lang);
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  }

  /**
   * Load language from localStorage
   */
  function loadLanguage() {
    try {
      return localStorage.getItem(CONFIG.storageKey);
    } catch (e) {
      console.warn('Could not load language preference:', e);
      return null;
    }
  }

  /**
   * Set language
   */
  function setLanguage(lang) {
    if (!CONFIG.availableLanguages.includes(lang)) return;
    applyLanguage(lang);
    saveLanguage(lang);
    updateUI();
  }

  /**
   * Get current language
   */
  function getCurrentLanguage() {
    return currentLanguage;
  }

  /**
   * Get available languages
   */
  function getAvailableLanguages() {
    return CONFIG.availableLanguages;
  }

  /**
   * Update UI elements to match current language
   */
  function updateUI() {
    const langBtns = document.querySelectorAll('.language-btn');
    langBtns.forEach(btn => {
      const isActive = btn.dataset.lang === currentLanguage;
      btn.classList.toggle('language-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    // Language buttons
    const langBtns = document.querySelectorAll('.language-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }

  /**
   * Public API
   */
  window.I18n = {
    init: initLanguage,
    t: translate,
    setLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    updatePageTranslations,
    updateUI,
    initEventListeners
  };

  // Initialize immediately (for no-flash)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLanguage();
      initEventListeners();
    });
  } else {
    initLanguage();
    initEventListeners();
  }
})();
