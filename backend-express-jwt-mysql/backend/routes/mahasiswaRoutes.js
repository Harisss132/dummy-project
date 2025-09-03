const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController.js');
const auth = require('../middleware/auth.js');
const { validateMahasiswaCreate, validateMahasiswaUpdate } = require('../middleware/validation.js');

router.get('/', mahasiswaController.getAll);            // public
router.get('/:id', mahasiswaController.getById);        // public
router.post('/', auth, validateMahasiswaCreate, mahasiswaController.create); // protected
router.put('/:id', auth, validateMahasiswaUpdate, mahasiswaController.update); // protected
router.delete('/:id', auth, mahasiswaController.remove); // protected

module.exports = router;


