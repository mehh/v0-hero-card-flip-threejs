# 3D Flip Card Hero Section

A stunning, interactive hero section built with **Next.js**, **Three.js (React Three Fiber)**, and **GSAP** featuring a grid of flip cards that reveal testimonial images on hover and scroll.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

![Hero Section Demo](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock)

## Features

- **Three.js 3D Rendering**: Real WebGL-powered 3D tiles with smooth GSAP flip animations
- **Interactive Flip Cards**: 10x8 grid of cards that flip to reveal grayscale testimonial images
- **Scroll-triggered Reveals**: Cards flip in a diagonal wave pattern as you scroll down the page
- **Hover Trail Effect**: Hovering over a card triggers neighboring cards (2 tile radius) to flip with a ripple effect
- **Auto Flip-back**: Cards automatically flip back after 2 seconds
- **Light/Dark Mode**: Full theme support - canvas background and tile colors adapt to theme
- **GSAP Animations**: Buttery smooth `power2.inOut` easing on all flip animations
- **Performance Optimized**: Throttled scroll handling, batched state updates, max 4 tiles revealed per scroll batch
- **Grayscale Shader**: Custom GLSL shader for grayscale image effect

## How It Works

### Three.js Architecture

```
Canvas (React Three Fiber)
├── Scene
│   ├── Background Color (theme-aware)
│   └── TileGrid (scaled to viewport)
│       └── FlipTile × 80
│           ├── Back Face (solid color mesh)
│           ├── Border (line segments)
│           ├── Front Face (textured mesh with grayscale shader)
│           └── Invisible Interaction Plane
```

### GSAP Flip Animation

Each tile uses GSAP's `gsap.to()` for smooth Y-axis rotation:

```tsx
gsap.to(groupRef.current.rotation, {
  y: isFlipped ? Math.PI : 0,
  duration: 0.6,
  ease: "power2.inOut",
})
```

### Scroll Reveal System

- Scroll progress is calculated as a percentage of viewport height
- Each tile has a threshold based on its diagonal position: `(row + col) / (ROWS + COLS - 2)`
- Tiles are queued for reveal (max 4 at a time) and processed every 100ms
- Prevents overwhelming the GPU with simultaneous animations

### Hover Trail Effect

1. Hovered tile flips immediately
2. Neighbors within 2-tile Manhattan distance flip with staggered delays (80ms × distance)
3. All tiles auto-flip-back after 2 seconds

### Theme System

- Canvas background: `#000000` (dark) / `#ffffff` (light)
- Tile back: `#141414` (dark) / `#f2f2f2` (light)
- Tile border: `#2e2e2e` (dark) / `#d9d9d9` (light)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **Three.js** | WebGL 3D rendering |
| **React Three Fiber** | React renderer for Three.js |
| **@react-three/drei** | Useful helpers (useTexture) |
| **GSAP** | Smooth flip animations |
| **Tailwind CSS v4** | Styling |
| **next-themes** | Dark/light mode |
| **shadcn/ui** | UI components |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/3d-flip-hero.git
cd 3d-flip-hero
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── globals.css       # Theme variables & Tailwind config
│   ├── layout.tsx        # Root layout with ThemeProvider
│   └── page.tsx          # Home page
├── components/
│   ├── hero-section.tsx  # Main Three.js canvas + flip logic
│   ├── hero-content.tsx  # Centered text overlay
│   ├── navbar.tsx        # Navigation with theme toggle
│   ├── theme-toggle.tsx  # Dark/light mode button
│   └── ui/               # shadcn/ui components
```

## Customization

### Grid Configuration

```tsx
const COLS = 10           // Number of columns
const ROWS = 8            // Number of rows
const TILE_SIZE = 1       // Size of each tile in 3D units
const GAP = 0.05          // Gap between tiles
```

### Animation Timing

```tsx
const FLIP_BACK_DELAY = 2000  // Auto flip-back delay (ms)

// GSAP animation config
gsap.to(rotation, {
  duration: 0.6,              // Flip duration
  ease: "power2.inOut",       // Easing function
})
```

### Custom Images

Replace the `testimonialImages` array:

```tsx
const testimonialImages = [
  "/images/person-1.jpg",
  "/images/person-2.jpg",
  // ... more images
]
```

### Theme Colors

Edit `components/hero-section.tsx`:

```tsx
// In FlipTile component
const backColor = isDark ? "#141414" : "#f2f2f2"
const borderColor = isDark ? "#2e2e2e" : "#d9d9d9"

// In Scene component
const bgColor = isDark ? "#000000" : "#ffffff"
```

## Performance Tips

1. **Image Optimization**: Use appropriately sized images (256px is ideal for tiles)
2. **DPR Capping**: Canvas uses `dpr={[1, 2]}` to cap device pixel ratio
3. **Batched Updates**: Scroll reveals are queued and processed at intervals
4. **Animation Guards**: GSAP animations check `isAnimatingRef` to prevent overlap

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or build manually:

```bash
npm run build
npm start
```

## Credits

- Built with [v0.app](https://v0.app) by Vercel
- Inspired by [delphi-three](https://github.com/thebuggeddev/delphi)
- [Three.js](https://threejs.org/) for 3D rendering
- [GSAP](https://greensock.com/gsap/) for animations
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

## License

MIT License - feel free to use this in your own projects!

---

**Made with Three.js + GSAP + Next.js**
