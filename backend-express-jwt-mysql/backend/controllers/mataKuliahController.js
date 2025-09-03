// controllers/categoryController.js
const pool = require('../config/db');

module.exports = {
  // GET /api/matakuliah
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM mata_kuliah ORDER BY id DESC');
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/matakuliah/:id
  getById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [rows] = await pool.execute('SELECT * FROM mata_kuliah WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Mata Kuliah tidak ditemukan' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  },

  // POST /api/matakuliah (protected)
  create: async (req, res, next) => {
    try {
      const { name } = req.body;
      const user_id = req.user ? req.user.id : null; // siapa yang membuat (opsional)

      const [result] = await pool.execute(
        'INSERT INTO mata_kuliah (name, user_id) VALUES (?, ?)',
        [name, user_id]
      );
      res.status(201).json({ id: result.insertId, name});
    } catch (err) { next(err); }
  },

  // PUT /api/mahasiswa/:id (protected)
  update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name } = req.body;

      // build dynamic update (simple)
      const fields = [];
      const values = [];
      if (name !== undefined) { fields.push('name = ?'); values.push(name); }

      if (fields.length === 0) return res.status(400).json({ message: 'Nothing to update' });

      values.push(id);
      const sql = `UPDATE mahasiswa SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(sql, values);

      if (result.affectedRows === 0) return res.status(404).json({ message: 'Mata Kuliah tidak ditemukan' });
      res.json({ message: 'Mata Kuliah diperbarui' });
    } catch (err) { next(err); }
  },

  // DELETE /api/mahasiswa/:id (protected)
  remove: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [result] = await pool.execute('DELETE FROM mata_kuliah WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'mata_kuliah tidak ditemukan' });
      res.json({ message: 'Mata Kuliah dihapus' });
    } catch (err) { next(err); }
  }
};


