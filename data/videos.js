/**
 * Video Gallery Data
 * Add videos here - supports local files and external embeds (YouTube/Vimeo)
 *
 * To add a new video:
 * 1. For local videos: Add the video file and thumbnail to the appropriate folder
 * 2. For YouTube/Vimeo: Copy the video URL
 * 3. Add an entry below with: thumb, src, category, title, and optional duration
 *
 * Supported formats:
 * - Local: .mp4, .webm, .mov (place in /videos/category/ folders)
 * - YouTube: https://youtube.com/watch?v=XXXX or https://youtu.be/XXXX
 * - Vimeo: https://vimeo.com/XXXX or https://player.vimeo.com/video/XXXX
 */

const VIDEOS = [
  // Cinematic
  {
    thumb: "videos/cinematic/golden-hour-thumb.jpg",
    src: "videos/cinematic/golden-hour.mp4",
    category: "cinematic",
    title: "Golden Hour",
    duration: "3:42"
  },
  {
    thumb: "videos/cinematic/midnight-city-thumb.jpg",
    src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "cinematic",
    title: "Midnight City",
    duration: "4:15"
  },
  {
    thumb: "videos/cinematic/chasing-light-thumb.jpg",
    src: "videos/cinematic/chasing-light.mp4",
    category: "cinematic",
    title: "Chasing Light",
    duration: "2:58"
  },

  // Documentary
  {
    thumb: "videos/documentary/artisans-thumb.jpg",
    src: "videos/documentary/artisans.mp4",
    category: "documentary",
    title: "The Artisans",
    duration: "12:30"
  },
  {
    thumb: "videos/documentary/street-musicians-thumb.jpg",
    src: "https://vimeo.com/123456789",
    category: "documentary",
    title: "Street Musicians",
    duration: "8:45"
  },

  // Event
  {
    thumb: "videos/event/wedding-2024-thumb.jpg",
    src: "videos/event/wedding-2024.mp4",
    category: "event",
    title: "Wedding 2024",
    duration: "5:10"
  },
  {
    thumb: "videos/event/corporate-gala-thumb.jpg",
    src: "videos/event/corporate-gala.mp4",
    category: "event",
    title: "Corporate Gala",
    duration: "3:20"
  },

  // Music Video
  {
    thumb: "videos/music-video/acoustic-session-thumb.jpg",
    src: "videos/music-video/acoustic-session.mp4",
    category: "music-video",
    title: "Acoustic Session",
    duration: "4:05"
  },
  {
    thumb: "videos/music-video/electric-dreams-thumb.jpg",
    src: "https://www.youtube.com/watch?v=example123",
    category: "music-video",
    title: "Electric Dreams",
    duration: "3:48"
  },

  // Commercial
  {
    thumb: "videos/commercial/product-launch-thumb.jpg",
    src: "videos/commercial/product-launch.mp4",
    category: "commercial",
    title: "Product Launch",
    duration: "1:30"
  },
  {
    thumb: "videos/commercial/brand-story-thumb.jpg",
    src: "videos/commercial/brand-story.mp4",
    category: "commercial",
    title: "Brand Story",
    duration: "2:15"
  },

  // Short Film
  {
    thumb: "videos/short-film/the-encounter-thumb.jpg",
    src: "videos/short-film/the-encounter.mp4",
    category: "short-film",
    title: "The Encounter",
    duration: "15:00"
  }
];
