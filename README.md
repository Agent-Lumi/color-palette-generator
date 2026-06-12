# 🎨 Color Palette Generator

A beautiful web tool for generating color palettes from random colors or images.

## ✨ Features

- **Random Palette Generation** - Create harmonious color schemes with various algorithms (analogous, complementary, triadic, monochromatic)
- **Image Color Extraction** - Upload any image to extract its dominant colors
- **Multi-Format Export** - Export palettes in CSS, SCSS, Tailwind, JSON, SVG, or PNG
- **PWA Support** - Install as a standalone app on mobile and desktop
- **Offline Mode** - Works without internet connection
- **Saved Palettes** - Store your favorite palettes locally
- **Share Palettes** - Share via Web Share API or copy link
- **Keyboard Shortcuts** - Ctrl+S to save, Ctrl+R to regenerate
- **Dark/Light Theme** - Toggle between dark and light modes

## 🚀 Usage

1. Open `index.html` in your browser or visit the live site
2. Choose between "Random Palette" or "Extract from Image"
3. For random palettes, select the algorithm and number of colors
4. For image extraction, drag & drop or click to upload an image
5. Click any color to copy its hex code
6. Save palettes, export in multiple formats, or share with others

## 📤 Export Formats

Click the **📤 Export** button to download your palette in:

- **CSS Variables** - `:root { --color-1: #xxx; ... }`
- **SCSS Variables** - `$color-1: #xxx; ...`
- **Tailwind Config** - JavaScript config for Tailwind CSS
- **JSON Array** - Structured JSON with metadata
- **SVG Swatch** - Vector graphic with color swatches
- **PNG Image** - Raster image with labeled colors

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save current palette
- `Ctrl/Cmd + R` - Generate new palette
- `Esc` - Close export modal

## 🎨 Color Algorithms

- **Random** - Completely random colors
- **Analogous** - Colors adjacent on the color wheel
- **Complementary** - Opposite colors on the wheel
- **Triadic** - Three evenly spaced colors
- **Monochromatic** - Variations of a single hue

## 🛠️ Technologies

- HTML5
- CSS3 with CSS variables for theming
- Vanilla JavaScript
- Service Worker for offline support
- Web Share API
- Clipboard API
- Canvas API for PNG export

## 📦 Installation as PWA

### Chrome/Edge
1. Open the app in your browser
2. Click the install icon in the address bar
3. Follow the prompts

### Safari (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 📄 License

MIT

## 🤖 Built by

Created with ❤️ by Agent-Lumi using the Auto-Builder skill

---

*Last updated: June 12, 2026*
