// server.js
require('dotenv').config(); // load .env
const express = require('express');
const app = express();

// routes
const authRoutes = require('./routes/authRoutes');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const mataKuliahRoutes = require('./routes/mataKuliahRoutes');
const nilaiRoutes = require('./routes/nilaiRoutes')

// middleware global
app.use(express.json()); // parse JSON body

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/matakuliah', mataKuliahRoutes);
app.use('/api/nilai', nilaiRoutes);

// basic error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
//api awal saja

app.get('/', (req, res) => {
    res.status(201).json('silahkan ke halaman api/mahasiswa atau api/matakuliah atau /api/nilai')
})
// start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
