// controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET belum di set');

const SALT_ROUNDS = 10; // bcrypt salt rounds

module.exports = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      // validasi sederhana
      if (!email || !password) return res.status(400).json({ message: 'email & password wajib' });
      if (password.length < 6) return res.status(400).json({ message: 'password minimal 6 karakter' });

      // cek apakah user sudah ada
      const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Email sudah terdaftar' });
      }

      // hash password
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);

      // insert user
      const [result] = await pool.execute(
        'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
        [email, name || null, hashed]
      );

      const insertedId = result.insertId;
      return res.status(201).json({ id: insertedId, email, name: name || null });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'email & password wajib' });

      // ambil user
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

      const user = rows[0];

      // bandingkan password
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      //  generate JWT / sign JWT (jangan simpan password di token)
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '3H' });

      return res.json({
        message: 'Login berhasil',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (err) {
      next(err);
    }
  }
};
