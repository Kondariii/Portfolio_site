/**
 * Photo Gallery Data
 * Add photos here - they will automatically appear in the gallery
 *
 * To add a new photo:
 * 1. Drop the image file into the appropriate category folder (/photos/street/, etc.)
 * 2. Add an entry below with: src, categories (array), and optional title
 * 3. Set featured: true for photos to appear on the homepage
 * Example entry:
 *   {
    src: "photos/street/rainy-evening.jpg",
    categories: ["street", "portrait"],
    title: "Rainy Evening",
    featured: true
  },
 */

const PHOTOS = [
  // Featured photos (appear on homepage)
  {
    src: "photos/product/DSC00653_2.jpg",
    categories: ["product"],
    title: "B&W Watch",
    featured: true
  },
  {
    src: "photos/product/DSC00653.jpg",
    categories: ["product"],
    title: "B&W Watch - alt",
    featured: true
  },
  {
    src: "photos/product/DSC00648.jpg",
    categories: ["product"],
    title: "Bracelet shot A",
    featured: false
  },
  {
    src: "photos/product/DSC00647.jpg",
    categories: ["product"],
    title: "Bracelet shot B",
    featured: true
  },


];
