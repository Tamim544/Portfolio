# 🌌 Tamim Chowdhury | Interactive 3D Portfolio

A high-end, immersive developer portfolio built with a focus on **premium aesthetics**, **interactive 3D physics**, and **cinematic motion**.

![Portfolio Hero View](file:///Users/tamimchowdhury/.gemini/antigravity/brain/5fed32ae-9f33-415c-9464-a80652a4d567/final_hero_view_1774431679102.png)

## ✨ Core Features

### 🤖 Interactive 3D Avatar (The Cute Robot)
- **Greeting Logic**: A custom "Hi" wave animation triggered on load or click.
- **Cheering Jump**: Synchronized vertical bounce with articulated finger wiggling and a dynamic mouth scale-up.
- **Mouse Tracking**: The robot's head and body smoothly track the visitor's cursor across the screen.
- **Blink Cycle**: Procedural blink logic for a lifelike experience.

### ⚛️ The Physics of My Stack
- **Cluster Gravity**: A 3D orbital physics simulation where tech stack spheres are pulled toward a common center.
- **Fluid Interaction**: High-damping physics that feels like the spheres are floating in liquid.
- **Mouse Repulsion**: Spheres gently push away from the cursor and slowly drift back into their cluster.

### 🖼️ Recent Creations (GitHub Integration)
- **Live Data**: Fetches and displays the top 6 most recently updated repositories directly via the GitHub API.
- **Premium Grid**: A responsive, spacious CSS grid layout replaced the standard carousel for a reading-friendly experience.
- **3D Tilting Cards**: Hovering over project cards triggers a perspective-based 3D tilt effect.

### 🎬 Cinematic Motion System
- **Warp Scroll**: Custom Framer Motion transitions where off-screen content blurs and "vanishes" into the periphery.
- **Staggered Cascade**: Hero text entries use a line-by-line staggered rise effect.
- **Glassmorphism**: Obsidian-themed UI with deep blurs, vibrant glows, and sharp borders.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/)
- **Physics**: [@react-three/cannon](https://github.com/pmndrs/use-cannon)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1.  **Extract the project**:
    ```bash
    cd Portfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Visit [http://localhost:3000](http://localhost:3000)** to view the live dashboard.

## 📁 Project Structure

```text
src/
├── app/             # Next.js App Router (Layouts & Global Styles)
├── components/      # Key Interactive Modules
│   ├── Hero.tsx     # 3D Avatar & Entrance Animations
│   ├── About.tsx    # Experience Timeline & Warp Logic
│   ├── TechStack.tsx# Orbital Physics Engine
│   └── Projects.tsx # GitHub API Integration & 3D Cards
└── hooks/           # Custom React Logic
```

---
© 2026 Tamim Chowdhury. Built with 🌌 Next.js & 3D Physics.
