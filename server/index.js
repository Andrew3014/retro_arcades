const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { pool } = require('./db');

const app = express();

// Preflight checks
if (!process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET no está definido. Configura la variable de entorno en Railway o en .env para desarrollo.');
  // No salir en dev local para permitir ver otros errores; salir en producción
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Log de origenes permitidos
console.log('[Startup] CORS_ORIGIN permitidos:', (process.env.CORS_ORIGIN || 'localhost defaults').split(',').map(s=>s.trim()));

const origins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s=>s.trim()) : ['http://localhost:3000','http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const isLocalhost = (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
      if (isLocalhost) return callback(null, true);
      if (origins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    } catch {
      return callback(new Error('Invalid origin'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB error' });
  }
});

app.use('/auth', require('./routes/auth'));
app.use('/games', require('./routes/games'));
app.use('/me', require('./routes/me'));
app.use('/admin', require('./routes/admin'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error inesperado' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
