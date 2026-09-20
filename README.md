<div align="center">

<img src="public/spritesheet/character.png" alt="DSA Visualizer Mascot" width="180" />

# DSA Visualizer

**Interactive Algorithm Visualization & Code Workspace**

[Live Demo](https://dsa.junaith.dev) · [Report Bug](https://github.com/JunaithSM/Algorithm-Visual/issues) · [Request Feature](https://github.com/JunaithSM/Algorithm-Visual/issues)

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ Features

- **16 Algorithms** — 5 Searching + 11 Sorting algorithms with step-by-step execution
- **Canvas Animations** — Real-time animated visualizations on HTML5 Canvas
- **Multi-Language Code Editor** — Monaco Editor supporting 18 programming languages
- **Sound Effects** — Synthesized audio feedback on comparisons, swaps, and results
- **Animated Mascot** — Sprite-sheet character guide with welcome sequence
- **Theory & Descriptions** — Detailed algorithm explanations with complexity analysis
- **Mobile Responsive** — Full-screen panels with bottom tab navigation on mobile
- **Monochrome Theme** — Clean black & white design with smooth transitions

---

## 📚 Supported Algorithms

| Searching | Sorting |
|-----------|---------|
| Linear Search | Bubble Sort |
| Binary Search | Selection Sort |
| Jump Search | Insertion Sort |
| Interpolation Search | Merge Sort |
| Exponential Search | Quick Sort |
| | Heap Sort |
| | Counting Sort |
| | Radix Sort |
| | Bucket Sort |
| | Shell Sort |
| | Cocktail Sort |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [TypeScript 5](https://typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Code Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Font | [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JunaithSM/Algorithm-Visual.git
cd Algorithm-Visual

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── [category]/[algorithm]/   # Dynamic algorithm pages
│   │   ├── layout.tsx            # Per-page SEO metadata
│   │   └── page.tsx              # Main workspace UI
│   ├── layout.tsx                # Root layout & global metadata
│   ├── robots.ts                 # SEO robots configuration
│   └── sitemap.ts                # Auto-generated sitemap
├── components/
│   ├── CartoonMascot.tsx         # Animated sprite mascot guide
│   ├── CodeArea.tsx              # Monaco code editor panel
│   ├── DescriptionPanel.tsx      # Algorithm theory & docs
│   ├── VisualizerPanel.tsx       # Execution controls & canvas
│   └── canvas/
│       ├── SearchingCanvasSimulator.tsx
│       └── SortingCanvasSimulator.tsx
├── lib/
│   ├── algorithms/               # Algorithm implementations (18 langs)
│   │   ├── Searching/
│   │   └── Sorting/
│   ├── visualizer/
│   │   ├── simulator.ts          # Step generation engine
│   │   ├── codeParser.ts         # Code instance parser
│   │   └── soundEffects.ts       # Web Audio API sounds
│   └── languages.ts              # Language configurations
└── public/
    └── spritesheet/              # Mascot animation sprites
```

---

## 🌐 Deployment

The app is deployed at **[dsa.junaith.dev](https://dsa.junaith.dev)**

All 16 algorithm pages are statically generated (SSG) at build time for optimal performance.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ☕ by <a href="https://github.com/JunaithSM">Junaith</a></sub>
</div>
