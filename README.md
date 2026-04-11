# Photography & Videography Portfolio

A complete, professional static portfolio website with zero build tools, no frameworks, and no server required. Works offline and can be hosted for free on GitHub Pages, Netlify, or Vercel.

---

## 📁 Folder Structure

```
Portfolio_Site/
├── index.html          # Homepage with hero and featured work
├── photography.html    # Photo gallery with masonry layout
├── videography.html    # Video gallery with modal player
├── about.html          # About page with bio and gear
├── contact.html        # Contact form and info
│
├── css/
│   ├── reset.css       # CSS reset and normalize
│   ├── variables.css   # Theme system (12 combinations)
│   ├── base.css        # Typography and base styles
│   ├── navbar.css      # Fixed navigation with mobile menu
│   ├── gallery.css     # Masonry grid and video cards
│   ├── lightbox.css    # Fullscreen image viewer
│   └── themes.css      # Theme panel UI styles
│
├── js/
│   ├── theme.js        # Dark/light + 6 color palettes
│   ├── nav.js          # Navbar scroll, mobile menu
│   ├── gallery.js      # Masonry, filtering, rendering
│   ├── lightbox.js     # Image lightbox with navigation
│   └── video.js        # Video modal player
│
├── data/
│   ├── photos.js       # Photo gallery data array
│   └── videos.js       # Video gallery data array
│
├── photos/             # Photo files (add your images here)
│   ├── street/
│   ├── portrait/
│   ├── landscape/
│   ├── architecture/
│   ├── documentary/
│   └── abstract/
│
└── videos/             # Video files and thumbnails
    ├── cinematic/
    ├── documentary/
    ├── event/
    ├── music-video/
    ├── commercial/
    └── short-film/
```

---

## 🚀 Quick Start

1. **Add your photos:** Drop images into `/photos/` subfolders by category
2. **Add your videos:** Place video files in `/videos/` and add thumbnails (JPG)
3. **Update the data:** Edit `data/photos.js` and `data/videos.js` to list your content
4. **Customize info:** Update name, bio, contact in `about.html` and `contact.html`
5. **Open or host:** Open `index.html` in a browser or deploy to GitHub Pages/Netlify

---

## 📝 How to Add Content

### Adding Photos

1. Copy your image file to the appropriate category folder:
   - `/photos/street/my-photo.jpg`
   - `/photos/portrait/headshot.jpg`

2. Open `data/photos.js` and add an entry:

```javascript
{
  src: "photos/street/my-photo.jpg",
  category: "street",
  title: "My Photo Title",        // Optional
  featured: true                  // Set true to show on homepage
}
```

### Adding Videos

1. Add your video file and a thumbnail image to the category folder:
   - `/videos/cinematic/film.mp4`
   - `/videos/cinematic/thumb.jpg`

2. Open `data/videos.js` and add an entry:

```javascript
{
  thumb: "videos/cinematic/thumb.jpg",
  src: "videos/cinematic/film.mp4",     // Local file OR YouTube/Vimeo URL
  category: "cinematic",
  title: "My Film Title",
  duration: "3:45"                      // Optional
}
```

For **YouTube or Vimeo**, just paste the full video URL instead of a local path:
```javascript
src: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
```

---

## 🎨 Theme System

The portfolio includes a **floating theme panel** (bottom-right gear icon) with:

- **2 base modes:** Dark and Light
- **6 color palettes:**
  - Purple (#7c3aed)
  - Orange (#ea580c)
  - Gray (#374151)
  - Teal (#0d9488)
  - Rose (#be185d)
  - Amber (#b45309)

Your selection is saved to localStorage and persists across all pages. No flash on page load—the theme applies immediately via inline script.

---

## ✨ Features

- **Photo Gallery:** CSS Masonry layout with category filtering and fullscreen lightbox
- **Video Gallery:** Grid layout with modal player supporting local files and YouTube/Vimeo
- **Responsive:** Mobile-first design with hamburger menu, tested at 375/768/1024/1440px
- **Performance:** Lazy loading, no layout shift, smooth animations
- **Accessibility:** WCAG AA contrast, keyboard navigation, screen reader support
- **Zero Dependencies:** Pure vanilla JS, only Google Fonts external

---

## 📱 Viewing Your Site

### Local
Simply double-click `index.html` or use a local server:
```bash
python -m http.server 8000
# or
npx serve .
```

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from branch" → `main` → `/ (root)`

### Netlify
1. Drag and drop the folder onto [netlify.com](https://netlify.com)
2. Or connect your GitHub repository

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

---

## 🛠️ Customization

### Change the name
- `index.html`: Update `<title>`, logo text, hero name
- All pages: Update `.navbar__logo` text
- `about.html`: Update bio sections

### Change colors
Edit `css/variables.css` - the palette colors are defined near the bottom with clear comments.

### Change fonts
Edit `css/variables.css`:
```css
--font-primary: 'Your Font', serif;
--font-secondary: 'Your UI Font', sans-serif;
```

Then update the Google Fonts link in each HTML `<head>`.

---

## 📧 Contact Form

The contact form uses a **mailto:** fallback by default (opens the user's email client).

### To use Formspree (recommended):
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. In `contact.html`, find the form and replace:
   - `action="mailto:..."` with `action="https://formspree.io/f/YOUR_FORM_ID"`
   - `method="post"`
   - Remove the `onsubmit` attribute
   - Remove `enctype="text/plain"`

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 📄 License

Free to use and modify for your own portfolio. Attribution appreciated but not required.

---

## 💡 Tips

- **Images:** Use high-quality JPGs or WebPs. The gallery preserves original file quality.
- **Thumbnails:** For videos, create 16:9 aspect ratio thumbnails for consistent layout.
- **Featured:** Set `featured: true` on 3-6 photos to populate the homepage grid nicely.
- **Categories:** Feel free to rename categories in the filter tabs (HTML) and data files.
