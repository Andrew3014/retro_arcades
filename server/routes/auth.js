const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { pool } = require('../db');

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (rows.length > 0) return res.status(409).json({ error: 'Email o usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password_hash, role) VALUES (?,?,?,\'user\')',
      [email, username, hash]
    );
    const user = { id: result.insertId, email, username, role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Datos inválidos', details: err.errors });
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [rows] = await pool.query('SELECT id, email, username, password_hash, role FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const userRow = rows[0];
    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = { id: userRow.id, email: userRow.email, username: userRow.username, role: userRow.role };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Datos inválidos', details: err.errors });
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
