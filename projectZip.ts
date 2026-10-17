import JSZip from 'jszip';

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // 1. README.md
  zip.file(
    'README.md',
    `# MyTrip Planner — Mysuru Heritage & Route Explorer

An elegant, step-by-step travel planner for Mysuru (Mysore), Karnataka, India.

## Key Features
- 🗺️ **Sequential Step-by-Step Itinerary**: Chronological tour from morning to evening with exact arrival times and stay durations.
- 📍 **Google Maps Navigation Integration**: Direct navigation links and full-route directions for all destinations.
- 📸 **High-Resolution Photography**: Authentic pictures of Amba Vilas Palace, Chamundi Hills, St. Philomena's, Zoo, Devaraja Market, and Brindavan Gardens.
- 💰 **Real-Time Budget Estimator**: Dynamic calculation of monument entry tickets, local transit, food, and shopping.
- 🍽️ **Culinary & Heritage Guide**: Detailed stories behind Mylari butter dosa, Hotel RRR banana leaf meals, and authentic Royal Mysore Pak.
- 🎨 **Royal Mysore Palettes**: Wadiyar Gold & Amber, Palace Illumination Night, Chamundi Sunset, and Sandalwood Silk themes.

## Project Structure
\`\`\`
├── index.html
├── package.json
├── server.ts            # Express backend with API endpoints
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx          # Main application & step router
    ├── main.tsx         # Entry point
    ├── index.css        # Styles & typography
    ├── types.ts         # TypeScript definitions
    ├── data/
    │   └── mysoreData.ts # Curated destinations, restaurants, and history
    └── components/
        ├── Navbar.tsx
        ├── BudgetTimingSetup.tsx
        ├── StepItineraryView.tsx
        ├── MapSection.tsx
        ├── FoodSection.tsx
        ├── HistorySection.tsx
        ├── ThemeModal.tsx
        └── GoogleMapModal.tsx
\`\`\`

## Getting Started
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run full-stack production server
npm run build
npm start
\`\`\`

Created with Google AI Studio Build.
`
  );

  // 2. package.json
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'mytrip-planner-mysuru',
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'vite --port=3000 --host=0.0.0.0',
          build: 'vite build',
          start: 'tsx server.ts',
          lint: 'tsc --noEmit',
        },
        dependencies: {
          express: '^4.21.2',
          jszip: '^3.10.2',
          leaflet: '^1.9.4',
          'lucide-react': '^0.546.0',
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          vite: '^8.3.0',
        },
        devDependencies: {
          '@types/express': '^4.17.21',
          '@types/jszip': '^3.4.1',
          '@types/leaflet': '^1.9.22',
          '@types/node': '^22.14.0',
          '@types/react': '^19.3.0',
          '@types/react-dom': '^19.3.0',
          '@tailwindcss/vite': '^4.3.3',
          tailwindcss: '^4.3.3',
          tsx: '^4.21.0',
          typescript: '^7.0.2',
        },
      },
      null,
      2
    )
  );

  // 3. index.html
  zip.file(
    'index.html',
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyTrip Planner - Mysore Heritage & Route Explorer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  );

  // 4. tsconfig.json
  zip.file(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
        },
        include: ['src', 'server.ts'],
      },
      null,
      2
    )
  );

  // 5. vite.config.ts
  zip.file(
    'vite.config.ts',
    `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
`
  );

  // 6. server.ts
  zip.file(
    'server.ts',
    `import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'MyTrip Planner Mysuru' });
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`
  );

  // 7. Generate ZIP Blob and trigger immediate browser download
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MyTrip-Planner-Mysuru-Project.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
