# Tesla Roadster 2028: The Future Flying Car (Interactive Automotive App)

A mobile-first, interactive automotive application celebrating the next-generation Tesla Roadster concept. Built with React, Three.js, React Three Fiber, Web Audio API, and TailwindCSS.

> **Disclaimer**: Concept details may change. This is a fan-made informational app, not official Tesla.

---

## Features

- **Exact Content Order Home Flow**: Fullscreen Launch Video → High-Res Concept Photo (with Lightbox) → Web Audio Synthesizer Controls → Thruster Info & Disclaimer → Manufacturing Timeline Status → Quick Navigation Cards → Specifications & Performance Highlights → 16-Question Searchable FAQ.
- **Interactive 3D WebGL Explorer**: High-detail 3D Roadster viewer with PBR materials, dark studio floor grid, 7 camera presets (Front, Rear, Sides, Top, Cockpit), 3 lighting environments (Studio Softbox, Cyber Neon, Sunset Glow), active wheel rotation, and custom `.glb` model uploader.
- **Synchronized SpaceX Thruster Demo**: Car levitation kinematics, dynamic exhaust point lights, 3D particle plumes, and Web Audio cold-gas thruster roar.
- **Paint Studio & Customizer**: 9 selectable automotive finishes including Pearl White, Gloss Red, Hot Pink, Diamond Pink (with surface micro-sparkles), Gloss Black, Shiny Black, Metallic Grey, Silver, and Electric Blue.
- **Battery Life & Driving-Time Calculator**: Validated math calculations with km/miles unit toggle, state-of-charge battery bar, and lithium-ion lifespan explainer.
- **Regional Pricing**: Separate cards for USA (USD $), UAE (AED د.إ), and Saudi Arabia (SAR ر.س) distinguishing reservation deposits from unannounced final vehicle MSRP.
- **Dual English & Arabic Localization**: Instant LTR / RTL switching with persistent memory.
- **16-Question FAQ Registry**: Searchable accordion with official Tesla source URLs and verification dates.

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```
The optimized production bundle will be generated inside the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## Deployment Guide

### Vercel
1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy site**.

### Static Web Host / S3 / Cloudflare Pages
- Upload the contents of the `dist/` folder directly to your web server root.
