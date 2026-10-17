<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# MyTrip Planner — Mysore Heritage & Route Explorer

An opulent, interactive Mysore trip planner featuring sequential step-by-step itineraries, Google Maps integration, interactive Leaflet route maps, dynamic budgeting, culinary guides, and royal Wadiyar heritage themes.

---

## 🚀 How to Run in VS Code

### Option 1: One-Click with VS Code Live Server (Easiest)
1. Open the project folder in **VS Code**.
2. In the VS Code File Explorer on the left, navigate to:
   - `dist/index.html` (or the root `index.html`).
3. Right-click `dist/index.html` (or `index.html`) and choose **"Open with Live Server"**.
4. Your browser will automatically open the application at `http://127.0.0.1:5500/dist/index.html` with all interactive features, themes, and maps working instantly!

---

### Option 2: Vite Development Server (For Modifying Code)
If you want to edit TypeScript or React components in `src/` with Hot Module Replacement (instant live reload):

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run the Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option 3: Full-Stack Express Server
If you want to run the optional Express backend server:

```bash
# Build the latest production bundle
npm run build

# Start the Express server
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Project Structure
- `dist/index.html` — Standalone, pre-bundled distribution file for **VS Code Live Server**
- `index.html` — Root entry point (automatically redirects to `dist/index.html` when served with Live Server)
- `src/` — React 19 + TypeScript source code:
  - `src/App.tsx` — Main application controller & state management
  - `src/components/` — Navbar, Step Itinerary, Map, Budget, Food, History, Theme & Google Maps modals
  - `src/data/mysoreData.ts` — Curated Mysore heritage monuments, timings, tickets, and photos
- `server.ts` — Optional Express backend for health check and ZIP downloads
- `vite.config.ts` — Vite configuration configured with relative paths (`base: './'`) for Live Server compatibility
