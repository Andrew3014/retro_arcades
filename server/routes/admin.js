const express = require('express');
const { authRequired, requireRole } = require('../middleware/auth');
const { pool } = require('../db');

const router = express.Router();

// Todas las rutas de admin requieren autenticación
router.use(authRequired);

router.get('/overview', requireRole('admin'), async (_req, res) => {
  const [[users]] = await pool.query('SELECT COUNT(*) AS users FROM users');
  const [[scores]] = await pool.query('SELECT COUNT(*) AS scores FROM scores WHERE is_deleted = 0');
  const [[comments]] = await pool.query('SELECT COUNT(*) AS comments FROM comments WHERE is_deleted = 0');
  const [[reports]] = await pool.query("SELECT COUNT(*) AS reports FROM reports WHERE status = 'open'");
  res.json({ users: users.users, scores: scores.scores, comments: comments.comments, openReports: reports.reports });
});

router.get('/comments', requireRole('admin'), async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, g.slug AS game, u.username, c.content, c.created_at AS date, c.is_deleted
     FROM comments c JOIN games g ON g.id = c.game_id JOIN users u ON u.id = c.user_id ORDER BY c.created_at DESC LIMIT 200`
  );
  res.json(rows);
});

router.delete('/comments/:id', requireRole('admin'), async (req, res) => {
  await pool.query('UPDATE comments SET is_deleted = 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

router.get('/reports', requireRole('admin'), async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT r.id, g.slug AS game, u.username, r.content, r.status, r.created_at AS date
     FROM reports r JOIN games g ON g.id = r.game_id JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC LIMIT 200`
  );
  res.json(rows);
});

router.put('/reports/:id', requireRole('admin'), async (req, res) => {
  const status = ['open', 'reviewed', 'fixed'].includes(req.body.status) ? req.body.status : 'reviewed';
  await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ ok: true });
});

router.delete('/reports/:id', requireRole('admin'), async (req, res) => {
  await pool.query('DELETE FROM reports WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// Gestión de puntajes (CRUD para el módulo principal)
router.get('/scores', requireRole('admin'), async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT s.id, g.slug AS game, u.username, ug.ranking_name, u.id AS user_id, s.score, s.is_deleted, s.created_at AS date
     FROM scores s
     JOIN games g ON g.id = s.game_id
     JOIN users u ON u.id = s.user_id
     LEFT JOIN user_games ug ON ug.user_id = s.user_id AND ug.game_id = s.game_id
     WHERE s.is_deleted = 0
     ORDER BY s.created_at DESC LIMIT 200`
  );
  res.json(rows);
});

router.put('/scores/:id', requireRole('admin'), async (req, res) => {
  const value = Number(req.body.score);
  if (!Number.isInteger(value) || value < 0) return res.status(400).json({ error: 'score inválido' });
  await pool.query('UPDATE scores SET score = ? WHERE id = ?', [value, req.params.id]);
  res.json({ ok: true });
});

router.delete('/scores/:id', requireRole('admin'), async (req, res) => {
  await pool.query('UPDATE scores SET is_deleted = 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// Listado de usuarios para el panel admin
router.get('/users', requireRole('admin'), async (_req, res) => {
  const [rows] = await pool.query('SELECT id, email, username, role, created_at FROM users ORDER BY created_at DESC LIMIT 500');
  res.json(rows);
});

// Cambiar ranking_name de un usuario para un juego específico
router.put('/ranking-name', requireRole('admin'), async (req, res) => {
  const { userId, game, rankingName } = req.body || {};
  if (!userId || !game || !rankingName || typeof rankingName !== 'string') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  if (rankingName.trim().length < 3 || rankingName.trim().length > 30) {
    return res.status(400).json({ error: 'Longitud inválida (3-30)' });
  }
  const [[g]] = await pool.query('SELECT id FROM games WHERE slug = ?', [game]);
  if (!g) return res.status(404).json({ error: 'Juego no encontrado' });
  const [[u]] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
  if (!u) return res.status(404).json({ error: 'Usuario no encontrado' });
  await pool.query(
    'INSERT INTO user_games (user_id, game_id, ranking_name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name)',
    [userId, g.id, rankingName.trim()]
  );
  res.json({ ok: true });
});

module.exports = router;
