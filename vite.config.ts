import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

const saveVideoPlugin = () => ({
  name: 'save-video-plugin',
  configureServer(server) {
    server.middlewares.use('/api/save-video', (req, res) => {
      if (req.method === 'POST') {
        const filePath = path.resolve(__dirname, 'public/veo-background.mp4');
        const writeStream = fs.createWriteStream(filePath);
        req.pipe(writeStream);
        req.on('end', () => {
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
        });
        req.on('error', (err) => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        });
      } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
      }
    });
  }
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), saveVideoPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
