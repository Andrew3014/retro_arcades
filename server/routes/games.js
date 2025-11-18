const express = require('express');
const { z } = require('zod');
const { pool } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, slug, title, year, creator_name, creator_photo_url, company_name, company_photo_url, cover_url FROM games ORDER BY id');
  res.json(rows);
});

router.get('/:slug', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM games WHERE slug = ?', [req.params.slug]);
  if (rows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  res.json(rows[0]);
});

router.get('/:slug/rankings', async (req, res) => {
  const [gameRows] = await pool.query('SELECT id FROM games WHERE slug = ?', [req.params.slug]);
  if (gameRows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  const gameId = gameRows[0].id;
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const [rows] = await pool.query(
    `SELECT ug.ranking_name AS name, u.username, s.best_score AS score, s.last_score_at AS date
     FROM (
       SELECT user_id, MAX(score) AS best_score, MAX(created_at) AS last_score_at
       FROM scores WHERE game_id = ? AND is_deleted = 0
       GROUP BY user_id
     ) s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN user_games ug ON ug.user_id = s.user_id AND ug.game_id = ?
     ORDER BY s.best_score DESC, s.last_score_at ASC
     LIMIT ?`,
    [gameId, gameId, limit]
  );
  const data = rows.map((r, i) => ({ rank: i + 1, name: r.name || r.username, score: r.score, date: r.date }));
  res.json(data);
});

router.get('/:slug/me', authRequired, async (req, res) => {
  const [gameRows] = await pool.query('SELECT id FROM games WHERE slug = ?', [req.params.slug]);
  if (gameRows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  const gameId = gameRows[0].id;

  const [bestRows] = await pool.query(
    'SELECT MAX(score) AS best FROM scores WHERE user_id = ? AND game_id = ? AND is_deleted = 0',
    [req.user.id, gameId]
  );
  const best = bestRows[0].best || 0;

  const [rankRows] = await pool.query(
    'SELECT COUNT(*) AS higher FROM (SELECT user_id, MAX(score) AS maxs FROM scores WHERE game_id = ? GROUP BY user_id) t WHERE t.maxs > ?',
    [gameId, best]
  );
  const [ugRows] = await pool.query('SELECT ranking_name FROM user_games WHERE user_id = ? AND game_id = ?', [req.user.id, gameId]);
  const name = ugRows[0]?.ranking_name;
  res.json({ best, rank: best ? rankRows[0].higher + 1 : null, rankingName: name || null });
});

const scoreSchema = z.object({ score: z.number().int().min(0), rankingName: z.string().min(3).max(30).optional() });

router.post('/:slug/scores', authRequired, async (req, res) => {
  const parse = scoreSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Datos inválidos', details: parse.error.errors });
  const { score, rankingName } = parse.data;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [gameRows] = await conn.query('SELECT id FROM games WHERE slug = ? FOR UPDATE', [req.params.slug]);
    if (gameRows.length === 0) { await conn.rollback(); return res.status(404).json({ error: 'Juego no encontrado' }); }
    const gameId = gameRows[0].id;

    const [ugRows] = await conn.query('SELECT id, ranking_name FROM user_games WHERE user_id = ? AND game_id = ? FOR UPDATE', [req.user.id, gameId]);
    if (ugRows.length === 0) {
      const candidate = (rankingName || '').trim();
      const initialName = candidate.length >= 3 ? candidate : (req.user.username || null);
      await conn.query('INSERT INTO user_games (user_id, game_id, ranking_name) VALUES (?,?,?)', [req.user.id, gameId, initialName]);
    }

    await conn.query('INSERT INTO scores (user_id, game_id, score) VALUES (?,?,?)', [req.user.id, gameId, score]);

    const [[prevBest]] = await conn.query('SELECT MAX(score) AS best FROM scores WHERE user_id = ? AND game_id = ? AND is_deleted = 0', [req.user.id, gameId]);
    const newRecord = prevBest.best === score; // after insert, max equals this score => possibly record or tie

    const [[rankRow]] = await conn.query(
      'SELECT COUNT(*) AS higher FROM (SELECT user_id, MAX(score) AS maxs FROM scores WHERE game_id = ? GROUP BY user_id) t WHERE t.maxs > ?',
      [gameId, score]
    );

    await conn.commit();
    res.json({ ok: true, newRecord, rank: rankRow.higher + 1 });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ error: 'Error guardando puntaje' });
  } finally {
    conn.release();
  }
});

router.get('/:slug/comments', async (req, res) => {
  const [gameRows] = await pool.query('SELECT id FROM games WHERE slug = ?', [req.params.slug]);
  if (gameRows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  const gameId = gameRows[0].id;
  const [rows] = await pool.query(
    `SELECT c.id, c.content, c.created_at AS date, COALESCE(ug.ranking_name, u.username) AS author
     FROM comments c
     JOIN users u ON u.id = c.user_id
     LEFT JOIN user_games ug ON ug.user_id = c.user_id AND ug.game_id = c.game_id
     WHERE c.game_id = ? AND c.is_deleted = 0
     ORDER BY c.created_at DESC
     LIMIT 100`,
    [gameId]
  );
  res.json(rows);
});

const commentSchema = z.object({ content: z.string().min(2).max(500) });
router.post('/:slug/comments', authRequired, async (req, res) => {
  const parse = commentSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Datos inválidos', details: parse.error.errors });
  const content = parse.data.content.trim();
  const [gameRows] = await pool.query('SELECT id FROM games WHERE slug = ?', [req.params.slug]);
  if (gameRows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  const gameId = gameRows[0].id;
  await pool.query('INSERT INTO comments (user_id, game_id, content) VALUES (?,?,?)', [req.user.id, gameId, content]);
  res.json({ ok: true });
});

const reportSchema = z.object({ content: z.string().min(2).max(500) });
router.post('/:slug/reports', authRequired, async (req, res) => {
  const parse = reportSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Datos inválidos', details: parse.error.errors });
  const content = parse.data.content.trim();
  const [gameRows] = await pool.query('SELECT id FROM games WHERE slug = ?', [req.params.slug]);
  if (gameRows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  const gameId = gameRows[0].id;
  await pool.query('INSERT INTO reports (user_id, game_id, content, status) VALUES (?,?,?,\'open\')', [req.user.id, gameId, content]);
  res.json({ ok: true });
});

// Obtener reportes del usuario actual
router.get('/my-reports/:slug', authRequired, async (req, res) => {
  const [gameRows] = await pool.query('SELECT id FROM games WHERE slug = ?', [req.params.slug]);
  if (gameRows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
  const gameId = gameRows[0].id;
  const [reports] = await pool.query(
    'SELECT id, content, status, created_at FROM reports WHERE user_id = ? AND game_id = ? ORDER BY created_at DESC',
    [req.user.id, gameId]
  );
  res.json(reports);
});

module.exports = router;
