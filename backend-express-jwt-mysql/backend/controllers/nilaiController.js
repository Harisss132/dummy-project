// controllers/movieController.js
const pool = require('../config/db');


//intro penjelasan :

//INNER JOIN
// Hanya ambil baris yang cocok di kedua tabel.
// → Kalau ada movie tanpa kategori, movie itu tidak ikut tampil.

// LEFT JOIN
// Ambil semua baris dari tabel kiri (movies), dan data dari tabel kanan (categories) kalau ada yang cocok.
// → Kalau movie tidak punya kategori, categoryName akan NULL, tapi movie tetap muncul.



module.exports = {
  // GET /api/nilai
  getAll: async (req, res, next) => {
    try {
      // join category to get category name
      const [rows] = await pool.execute(
        `SELECT n.*, mh.name AS mahasiswaName, mk.name AS matakuliahName
         FROM nilai n
         LEFT JOIN mahasiswa mh ON n.mahasiswa_id = mh.id
         LEFT JOIN mata_kuliah mk ON n.mata_kuliah_id = mk.id
         ORDER BY n.id DESC`
      );
      res.json(rows);
    } catch (err) { next(err); }
  },

  // GET /api/nilai/:id
  getById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [rows] = await pool.execute(
        `SELECT n.*, mh.name AS mahasiswaName, mk.name AS matakuliahName
         FROM nilai n
         LEFT JOIN mahasiswa mh ON n.mahasiswa_id = mh.id
         LEFT JOIN mata_kuliah mk ON n.mata_kuliah_id = mk.id
         WHERE n.id = ?`, [id]
      );
      if (rows.length === 0) return res.status(404).json({ message: 'Nilai tidak ditemukan' });
      res.json(rows[0]);
    } catch (err) { next(err); }
  },

  // POST /api/nilai (protected)
  create: async (req, res, next) => {
  try {
    const { name, skor, mahasiswa_id, mata_kuliah_id } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (name === undefined || skor === undefined) {
      return res.status(400).json({ message: 'Input nama dan skor tidak boleh kosong.' });
    }

    // Validasi skor (tetap sama)
    const numericSkor = parseInt(skor, 10);
    if (isNaN(numericSkor)) {
      return res.status(400).json({ message: 'Input skor harus berupa angka.' });
    }
    if (numericSkor < 0 || numericSkor > 100) {
      return res.status(400).json({ message: 'Skor harus di antara 0 dan 100.' });
    }

    // Konversi skor ke grade/indeks (tetap sama)
    let grade;
    if (numericSkor > 80) grade = 'A';
    else if (numericSkor > 70) grade = 'B';
    else if (numericSkor > 60) grade = 'C';
    else if (numericSkor > 50) grade = 'D';
    else grade = 'E';

    // PERUBAHAN DI SINI: Query INSERT diubah untuk menyertakan kolom 'indeks'
    const sql = `
      INSERT INTO nilai (name, skor, indeks, mahasiswa_id, mata_kuliah_id, user_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name, 
      numericSkor, // Simpan skor ANGKA ke kolom 'skor'
      grade,       // Simpan nilai HURUF (grade) ke kolom 'indeks'
      mahasiswa_id || null, 
      mata_kuliah_id || null, 
      user_id
    ];
    
    const [result] = await pool.execute(sql, values);

    res.status(201).json({
      message: 'Data nilai berhasil dibuat.',
      id: result.insertId,
      name: name,
      skor: numericSkor, // Kirim kembali skor angka
      indeks: grade,     // Kirim kembali nilai huruf
      mahasiswa_id: mahasiswa_id || null,
      mata_kuliah_id: mata_kuliah_id || null
    });
  } catch (err) {
    next(err);
  }
},

  // PUT /api/nilai/:id (protected)
  update: async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, skor, mahasiswa_id, mata_kuliah_id } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }

    // PERUBAHAN DI SINI: Jika skor di-update, perbarui kolom 'skor' dan 'indeks'
    if (skor !== undefined) {
      const numericSkor = parseInt(skor, 10);
      if (isNaN(numericSkor)) {
        return res.status(400).json({ message: 'Input skor harus berupa angka.' });
      }
      if (numericSkor < 0 || numericSkor > 100) {
        return res.status(400).json({ message: 'Skor harus di antara 0 dan 100.' });
      }

      let grade;
      if (numericSkor > 80) grade = 'A';
      else if (numericSkor > 70) grade = 'B';
      else if (numericSkor > 60) grade = 'C';
      else if (numericSkor > 50) grade = 'D';
      else grade = 'E';
      
      // Update kedua kolom sekaligus
      fields.push('skor = ?', 'indeks = ?');
      // Masukkan kedua nilai ke array values
      values.push(numericSkor, grade);
    }

    if (mahasiswa_id !== undefined) {
      fields.push('mahasiswa_id = ?');
      values.push(mahasiswa_id);
    }
    
    if (mata_kuliah_id !== undefined) {
      fields.push('mata_kuliah_id = ?');
      values.push(mata_kuliah_id);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Tidak ada data yang perlu diperbarui' });
    }

    values.push(id);

    const sql = `UPDATE nilai SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data nilai tidak ditemukan' });
    }
    
    res.json({ message: 'Data nilai berhasil diperbarui' });
  } catch (err) {
    next(err);
  }
},

  // DELETE /api/nilai/:id (protected)
  remove: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [result] = await pool.execute('DELETE FROM nilai WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Nilai tidak ditemukan' });
      res.json({ message: 'Nilai dihapus' });
    } catch (err) { next(err); }
  }
};
