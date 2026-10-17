import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to recursively add files to zip
function addDirectoryToZip(zip: JSZip, dirPath: string, rootDir: string) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (['node_modules', '.git', 'dist', '.cache'].includes(item)) continue;
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, rootDir);
    } else {
      const data = fs.readFileSync(fullPath);
      zip.file(relPath, data);
    }
  }
}

// API: Download Project ZIP
app.get('/api/download-zip', async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    addDirectoryToZip(zip, __dirname, __dirname);

    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="mytrip-planner-mysuru.zip"');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error('Failed to generate zip:', err);
    res.status(500).json({ error: 'Failed to create zip file' });
  }
});

// API: Get Mysore Weather
app.get('/api/weather/mysore', (req: Request, res: Response) => {
  res.json({
    city: 'Mysuru, Karnataka',
    tempC: 28,
    condition: 'Pleasant & Sunny',
    humidity: '58%',
    bestTimeToVisit: 'October to March (Dasara & Winter Season)',
  });
});

// API: Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'MyTrip Planner Mysore',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('MyTrip Planner server running. Run `npm run build` to build dist.');
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🏰 MyTrip Planner server listening on port ${PORT}`);
  });
}

export default app;
