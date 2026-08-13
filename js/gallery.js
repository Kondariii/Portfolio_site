/**
 * Gallery Module
 *
 * Handles:
 * - Photo gallery
 * - Dynamic masonry grid
 * - Category filtering
 * - Responsive layout
 * - Image loading
 * - Lightbox
 * - Video gallery
 * - Video filtering
 */

(function () {

  'use strict';


  /* ============================================
     CONFIGURATION
  ============================================ */

  const CONFIG = {

    /*
     * Height of one invisible CSS grid row.
     *
     * Smaller = more accurate masonry.
     */

    rowHeight: 8,

    /*
     * Grid gap is taken from CSS.
     */

    filterFadeDuration: 250,

    itemAnimationDelay: 40,

    filterItemDelay: 30

  };


  /* ============================================
     STATE
  ============================================ */

  let currentFilter = 'all';

  let galleryItems = [];

  let videoItems = [];

  let resizeObserver = null;


  /* ============================================
     INITIALIZATION
  ============================================ */

  function init() {

    initPhotoGallery();

    initVideoGallery();

  }


  /* ============================================
     PHOTO GALLERY
  ============================================ */

  function initPhotoGallery() {

    const gallery =
      document.querySelector('.gallery');


    const filterContainer =
      document.querySelector('.gallery-filters');


    if (
      !gallery ||
      typeof PHOTOS === 'undefined'
    ) {

      return;

    }


    renderGallery();


    if (filterContainer) {

      initFilters(
        filterContainer,
        'photo'
      );

    }

  }


  /* ============================================
     RENDER PHOTO GALLERY
  ============================================ */

  function renderGallery() {

    const gallery =
      document.querySelector('.gallery');


    if (!gallery) {
      return;
    }


    /*
     * Determine whether this is the homepage.
     */

    const isHomePage =
      !document.querySelector('.gallery-filters');


    /*
     * Homepage gets only featured photos.
     */

    const itemsToRender =
      isHomePage

        ? PHOTOS
            .filter(photo => photo.featured)
            .slice(0, 3)

        : PHOTOS;


    /*
     * Create HTML.
     */

    const html =
      itemsToRender
        .map((photo, index) => {

          const title =
            photo.title ||
            getFilenameFromPath(photo.src);


          const categories =
            Array.isArray(photo.categories)

              ? photo.categories

              : [];


          const categoriesAttr =
            JSON.stringify(categories);


          const categoriesDisplay =
            categories.join(' / ');


          const primaryCategory =
            categories.length > 0

              ? categories[0]

              : '';


          return `
            <div
              class="gallery__item"
              data-category="${escapeAttribute(primaryCategory)}"
              data-categories='${escapeAttribute(categoriesAttr)}'
              data-index="${index}"
            >

              <div class="gallery__image-wrapper">

                <img
                  src="${escapeAttribute(photo.src)}"
                  alt="${escapeAttribute(title)}"
                  class="gallery__image"
                  loading="${index < 6 ? 'eager' : 'lazy'}"
                  decoding="async"
                  draggable="false"
                >

                <div class="gallery__overlay">

                  ${
                    categoriesDisplay
                      ? `
                        <span class="gallery__category">
                          ${escapeHTML(categoriesDisplay)}
                        </span>
                      `
                      : ''
                  }

                  ${
                    photo.title
                      ? `
                        <h3 class="gallery__title">
                          ${escapeHTML(photo.title)}
                        </h3>
                      `
                      : ''
                  }

                </div>

              </div>

            </div>
          `;

        })
        .join('');


    gallery.innerHTML = html;


    /*
     * Store items.
     */

    galleryItems =
      Array.from(
        gallery.querySelectorAll(
          '.gallery__item'
        )
      );


    /*
     * Set up images.
     */

    setupGalleryImages();


    /*
     * Set up lightbox.
     */

    setupLightbox(itemsToRender);


    /*
     * Set initial layout.
     */

    waitForImagesAndLayout();


    /*
     * Animate.
     */

    animateGalleryItems();

  }


  /* ============================================
     IMAGE SETUP
  ============================================ */

  function setupGalleryImages() {

    const images =
      document.querySelectorAll(
        '.gallery__image'
      );


    images.forEach(img => {

      /*
       * Prevent right-click.
       */

      img.addEventListener(
        'contextmenu',
        event => {

          event.preventDefault();

        }
      );


      /*
       * Prevent dragging.
       */

      img.addEventListener(
        'dragstart',
        event => {

          event.preventDefault();

        }
      );


      /*
       * Detect orientation.
       */

      if (img.complete) {

        applyOrientationClass(img);

      } else {

        img.addEventListener(
          'load',
          () => {

            applyOrientationClass(img);

          },
          { once: true }
        );

      }

    });

  }


  /* ============================================
     ORIENTATION CLASS
  ============================================ */

  function applyOrientationClass(img) {

    const item =
      img.closest('.gallery__item');


    if (!item) {
      return;
    }


    if (
      !img.naturalWidth ||
      !img.naturalHeight
    ) {

      return;

    }


    const ratio =
      img.naturalWidth /
      img.naturalHeight;


    item.classList.remove(
      'gallery__item--vertical',
      'gallery__item--horizontal',
      'gallery__item--square'
    );


    if (ratio < 0.8) {

      item.classList.add(
        'gallery__item--vertical'
      );

    } else if (ratio > 1.2) {

      item.classList.add(
        'gallery__item--horizontal'
      );

    } else {

      item.classList.add(
        'gallery__item--square'
      );

    }

  }


  /* ============================================
     WAIT FOR IMAGES
  ============================================ */

  function waitForImagesAndLayout() {

    const images =
      Array.from(
        document.querySelectorAll(
          '.gallery__image'
        )
      );


    if (images.length === 0) {
      return;
    }


    /*
     * Wait until all currently loaded images
     * have dimensions available.
     */

    const promises =
      images.map(img => {

        if (img.complete) {

          return Promise.resolve();

        }


        return new Promise(resolve => {

          img.addEventListener(
            'load',
            resolve,
            { once: true }
          );


          img.addEventListener(
            'error',
            resolve,
            { once: true }
          );

        });

      });


    Promise.all(promises)
      .then(() => {

        requestAnimationFrame(() => {

          updateGalleryLayout();

          setupResizeObserver();

        });

      });

  }


  /* ============================================
     DYNAMIC MASONRY LAYOUT
  ============================================ */

  function updateGalleryLayout() {

    const gallery =
      document.querySelector('.gallery');


    if (!gallery) {
      return;
    }


    /*
     * Don't use masonry calculations on mobile.
     */

    if (
      window.matchMedia(
        '(max-width: 640px)'
      ).matches
    ) {

      galleryItems.forEach(item => {

        item.style.gridRow =
          'auto';

      });

      return;

    }


    /*
     * Get the actual grid row height.
     */

    const styles =
      getComputedStyle(gallery);


    const rowHeight =
      parseFloat(
        styles.getPropertyValue(
          '--gallery-row-height'
        )
      ) || CONFIG.rowHeight;


    /*
     * Get actual gap.
     */

    const gap =
      parseFloat(
        styles.rowGap
      ) || 0;


    /*
     * Calculate each image's row span.
     */

    galleryItems.forEach(item => {

      /*
       * Ignore filtered-out items.
       */

      if (
        item.style.display === 'none'
      ) {

        return;

      }


      const img =
        item.querySelector(
          '.gallery__image'
        );


      if (
        !img ||
        !img.naturalWidth ||
        !img.naturalHeight
      ) {

        return;

      }


      /*
       * Width of the grid item.
       */

      const itemWidth =
        item.getBoundingClientRect().width;


      if (itemWidth <= 0) {
        return;
      }


      /*
       * Calculate the natural image height
       * at the current displayed width.
       *
       * Example:
       *
       * 3000 × 4500
       *
       * width = 500
       *
       * height = 750
       */

      const naturalHeight =
        itemWidth *
        (
          img.naturalHeight /
          img.naturalWidth
        );


      /*
       * CSS grid row span formula.
       *
       * Each row is rowHeight tall.
       * Every gap also takes space.
       */

      const rowSpan =
        Math.ceil(
          (
            naturalHeight + gap
          ) /
          (
            rowHeight + gap
          )
        );


      /*
       * Apply the calculated span.
       */

      item.style.gridRow =
        `span ${Math.max(1, rowSpan)}`;

    });

  }


  /* ============================================
     RESIZE OBSERVER
  ============================================ */

  function setupResizeObserver() {

    /*
     * Don't create multiple observers.
     */

    if (resizeObserver) {

      resizeObserver.disconnect();

    }


    const gallery =
      document.querySelector('.gallery');


    if (!gallery) {
      return;
    }


    /*
     * Recalculate whenever the gallery
     * changes width.
     */

    resizeObserver =
      new ResizeObserver(() => {

        requestAnimationFrame(() => {

          updateGalleryLayout();

        });

      });


    resizeObserver.observe(gallery);

  }


  /* ============================================
     LIGHTBOX
  ============================================ */

  function setupLightbox(itemsToRender) {

    galleryItems.forEach(item => {

      const index =
        parseInt(
          item.dataset.index,
          10
        );


      const photo =
        itemsToRender[index];


      if (!photo) {
        return;
      }


      item.addEventListener(
        'click',
        () => {

          if (
            window.Lightbox &&
            typeof window.Lightbox.open ===
              'function'
          ) {

            window.Lightbox.open(
              photo,
              currentFilter
            );

          }

        }
      );

    });

  }


  /* ============================================
     ANIMATE ITEMS
  ============================================ */

  function animateGalleryItems() {

    requestAnimationFrame(() => {

      galleryItems.forEach(
        (item, index) => {

          setTimeout(() => {

            item.classList.add(
              'is-visible'
            );

          }, index *
            CONFIG.itemAnimationDelay);

        }
      );

    });

  }


  /* ============================================
     FILTER PHOTO GALLERY
  ============================================ */

  function filterGallery(category) {

    const gallery =
      document.querySelector('.gallery');


    if (!gallery) {
      return;
    }


    /*
     * Fade out.
     */

    gallery.classList.add(
      'is-changing'
    );


    setTimeout(() => {

      galleryItems.forEach(item => {

        let itemCategories = [];


        try {

          itemCategories =
            JSON.parse(
              item.dataset.categories ||
              '[]'
            );

        } catch (error) {

          itemCategories = [
            item.dataset.category
          ];

        }


        const shouldShow =
          category === 'all' ||
          itemCategories.includes(
            category
          );


        if (shouldShow) {

          item.style.display = '';

          item.classList.remove(
            'gallery__item--hidden'
          );

        } else {

          item.style.display = 'none';

          item.classList.add(
            'gallery__item--hidden'
          );

        }

      });


      /*
       * Recalculate the grid AFTER
       * filtering.
       */

      requestAnimationFrame(() => {

        updateGalleryLayout();


        gallery.classList.remove(
          'is-changing'
        );


        const visibleItems =
          galleryItems.filter(
            item =>
              item.style.display !==
              'none'
          );


        /*
         * Reset animations.
         */

        visibleItems.forEach(item => {

          item.classList.remove(
            'is-visible'
          );

        });


        /*
         * Animate them again.
         */

        requestAnimationFrame(() => {

          visibleItems.forEach(
            (item, index) => {

              setTimeout(() => {

                item.classList.add(
                  'is-visible'
                );

              }, index *
                CONFIG.filterItemDelay);

            }
          );

        });

      });

    }, CONFIG.filterFadeDuration);

  }


  /* ============================================
     VIDEO GALLERY
  ============================================ */

  function initVideoGallery() {

    const videoGrid =
      document.querySelector(
        '.video-grid'
      );


    const filterContainer =
      document.querySelector(
        '.video-filters'
      );


    if (
      !videoGrid ||
      typeof VIDEOS === 'undefined'
    ) {

      return;

    }


    renderVideoGrid();


    if (filterContainer) {

      initFilters(
        filterContainer,
        'video'
      );

    }

  }


  /* ============================================
     RENDER VIDEO GRID
  ============================================ */

  function renderVideoGrid() {

    const videoGrid =
      document.querySelector(
        '.video-grid'
      );


    if (!videoGrid) {
      return;
    }


    const html =
      VIDEOS
        .map((video, index) => {

          return `
            <div
              class="video-card"
              data-category="${escapeAttribute(
                video.category || ''
              )}"
              data-index="${index}"
            >

              <div
                class="video-card__thumb-wrapper"
              >

                <img
                  src="${escapeAttribute(
                    video.thumb
                  )}"
                  alt="${escapeAttribute(
                    video.title ||
                    'Video'
                  )}"
                  class="video-card__thumb"
                  loading="${
                    index < 6
                      ? 'eager'
                      : 'lazy'
                  }"
                  decoding="async"
                >

                <div class="video-card__play">

                  <div
                    class="video-card__play-icon"
                  ></div>

                </div>

                ${
                  video.duration
                    ? `
                      <span
                        class="video-card__duration"
                      >
                        ${escapeHTML(
                          video.duration
                        )}
                      </span>
                    `
                    : ''
                }

              </div>

              <div class="video-card__info">

                <h3
                  class="video-card__title"
                >
                  ${escapeHTML(
                    video.title || ''
                  )}
                </h3>

                <span
                  class="video-card__category"
                >
                  ${escapeHTML(
                    video.category || ''
                  )}
                </span>

              </div>

            </div>
          `;

        })
        .join('');


    videoGrid.innerHTML = html;


    videoItems =
      Array.from(
        videoGrid.querySelectorAll(
          '.video-card'
        )
      );


    /*
     * Video click handlers.
     */

    videoItems.forEach(item => {

      const index =
        parseInt(
          item.dataset.index,
          10
        );


      item.addEventListener(
        'click',
        () => {

          if (
            window.VideoModal &&
            typeof window.VideoModal.open ===
              'function'
          ) {

            window.VideoModal.open(index);

          }

        }
      );

    });

  }


  /* ============================================
     FILTER INITIALIZATION
  ============================================ */

  function initFilters(
    container,
    type
  ) {

    const tabs =
      container.querySelectorAll(
        '.filter-tab'
      );


    tabs.forEach(tab => {

      tab.addEventListener(
        'click',
        () => {

          const category =
            tab.dataset.filter;


          /*
           * Active button.
           */

          tabs.forEach(t => {

            t.classList.remove(
              'filter-tab--active'
            );

          });


          tab.classList.add(
            'filter-tab--active'
          );


          /*
           * Apply filter.
           */

          if (type === 'photo') {

            filterGallery(
              category
            );

          } else {

            filterVideos(
              category
            );

          }


          currentFilter =
            category;

        }
      );

    });

  }


  /* ============================================
     FILTER VIDEOS
  ============================================ */

  function filterVideos(category) {

    videoItems.forEach(item => {

      const itemCategory =
        item.dataset.category;


      const shouldShow =
        category === 'all' ||
        itemCategory === category;


      if (shouldShow) {

        item.classList.remove(
          'video-card--hidden'
        );

        item.style.display = '';

      } else {

        item.classList.add(
          'video-card--hidden'
        );

        item.style.display = 'none';

      }

    });

  }


  /* ============================================
     GET FILTERED PHOTOS
  ============================================ */

  function getFilteredPhotos(
    filter = 'all'
  ) {

    if (filter === 'all') {

      return PHOTOS;

    }


    return PHOTOS.filter(photo => {

      return (
        Array.isArray(
          photo.categories
        ) &&
        photo.categories.includes(
          filter
        )
      );

    });

  }


  /* ============================================
     GET FILTERED VIDEOS
  ============================================ */

  function getFilteredVideos(
    filter = 'all'
  ) {

    if (filter === 'all') {

      return VIDEOS;

    }


    return VIDEOS.filter(video => {

      return (
        video.category === filter
      );

    });

  }


  /* ============================================
     FILENAME HELPER
  ============================================ */

  function getFilenameFromPath(path) {

    if (!path) {

      return 'Untitled';

    }


    return path
      .split('/')
      .pop()
      .split('.')[0]
      .replace(
        /[-_]/g,
        ' '
      );

  }


  /* ============================================
     HTML ESCAPING
  ============================================ */

  function escapeHTML(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return '';

    }


    return String(value)
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );

  }


  /* ============================================
     ATTRIBUTE ESCAPING
  ============================================ */

  function escapeAttribute(value) {

    return escapeHTML(value);

  }


  /* ============================================
     PUBLIC API
  ============================================ */

  window.Gallery = {

    init,

    filterGallery,

    filterVideos,

    getFilteredPhotos,

    getFilteredVideos,

    get currentFilter() {

      return currentFilter;

    }

  };


  /* ============================================
     DOM READY
  ============================================ */

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }

})();