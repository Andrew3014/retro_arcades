const express = require('express');
const { z } = require('zod');
const { authRequired } = require('../middleware/auth');
const { pool } = require('../db');

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const [rows] = await pool.query('SELECT id, email, username, role FROM users WHERE id = ?', [req.user.id]);
  res.json(rows[0]);
});

router.get('/scores', authRequired, async (req, res) => {
  const gameSlug = req.query.game;
  let gameId = null;
  if (gameSlug) {
    const [g] = await pool.query('SELECT id FROM games WHERE slug = ?', [gameSlug]);
    if (g.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
    gameId = g[0].id;
  }
  const params = [req.user.id];
  let sql = 'SELECT s.id, s.game_id, g.slug, s.score, s.created_at AS date FROM scores s JOIN games g ON g.id = s.game_id WHERE s.user_id = ? AND s.is_deleted = 0';
  if (gameId) { sql += ' AND s.game_id = ?'; params.push(gameId); }
  sql += ' ORDER BY s.created_at DESC LIMIT 200';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

const updateRankingSchema = z.object({ game: z.string().min(2), rankingName: z.string().min(3).max(30) });
router.put('/ranking-name', authRequired, async (req, res) => {
  const parse = updateRankingSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Datos inválidos', details: parse.error.errors });
  const { game, rankingName } = parse.data;
  const [[g]] = await pool.query('SELECT id FROM games WHERE slug = ?', [game]);
  if (!g) return res.status(404).json({ error: 'Juego no encontrado' });
  await pool.query(
    'INSERT INTO user_games (user_id, game_id, ranking_name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name)',
    [req.user.id, g.id, rankingName.trim()]
  );
  res.json({ ok: true });
});

module.exports = router;
