import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const PYTHON_PORT = 8001;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // 1. Launch Python 3.10+ Backend Process
  const pythonPath = process.env.PYTHON_PATH || (process.platform === 'win32' ? 'python' : 'python3');
  const scriptPath = path.join(__dirname, 'backend', 'server.py');

  console.log(`[FullStack] Launching Python backend: ${pythonPath} ${scriptPath} ${PYTHON_PORT}`);
  const pyProcess = spawn(pythonPath, [scriptPath, String(PYTHON_PORT)], {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'backend'),
  });

  pyProcess.on('error', (err) => {
    console.error('[FullStack] Failed to start Python process:', err);
  });

  // 2. Proxy API routes to Python REST Server
  app.all('/api/*', async (req, res) => {
    const targetUrl = `http://127.0.0.1:${PYTHON_PORT}${req.originalUrl}`;
    try {
      const fetchOptions: RequestInit = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      if (!['GET', 'HEAD'].includes(req.method) && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      console.error(`[FullStack] Error forwarding to Python: ${err}`);
      res.status(502).json({
        error: 'Python backend service temporarily unavailable',
        details: String(err),
      });
    }
  });

  // 3. Mount Vite middleware for dev or serve dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Graceful shutdown
  const cleanup = () => {
    console.log('[FullStack] Shutting down Python backend process...');
    pyProcess.kill();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FullStack] WeldTrack Pro running on http://0.0.0.0:${PORT} (Python on :${PYTHON_PORT})`);
  });
}

startServer();
