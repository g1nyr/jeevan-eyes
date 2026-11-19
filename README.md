# Jeevan's Eyes

Personal website, journal, and photo gallery built with vanilla HTML, CSS, and JavaScript.

## Overview

A minimal Bento-grid dashboard designed as a personal corner on the web. Built without frameworks or build tools so it remains fast, lightweight, and easy to maintain.

### Features
- **Journal:** Full-screen article reader with keyboard navigation (`Esc`, `Left`, `Right`).
- **Music Player:** Shuffled audio player with cover art, seekable progress bar, and `Space` play/pause control.
- **Gallery:** Curated photo grid and carousel with a lightbox viewer.
- **Local Context:** Live weather (via Open-Meteo), IST clock, and a Leaflet map centered on Mehdipatnam, Hyderabad.
- **Contact:** Direct messaging routed to email via FormSubmit.
- **Themes:** Light and dark mode with saved preference.

## Structure

```text
├── index.html          # Markup, layout, and modals
├── styles.css          # Theme variables, grid layout, and styling
├── app.js              # Content arrays, audio player, weather API, and UI logic
└── assets/photos/      # Photography, audio tracks, cover art, and icons
```

## Updating Content

**Adding a journal entry**
Add a new object to the top of the `blogPosts` array in `app.js`:

```js
{
  id: "post-slug",
  date: "Nov 2026",
  title: "Entry Title",
  summary: "Short preview line.",
  content: [
    "First paragraph...",
    "Second paragraph..."
  ]
}
```

**Adding a track**
Place the `.mp3` and cover image inside `assets/photos/`, then register it in the `playlist` array in `app.js`:

```js
{
  title: "Track Name",
  artist: "Artist",
  src: "assets/photos/track.mp3",
  cover: "assets/photos/cover.jpg"
}
```

## Local Setup

Clone the repository and open `index.html` in a browser, or serve it with any static server:

```bash
git clone https://github.com/jeevannayyar0/jeevan-eyes.git
cd jeevan-eyes
```
