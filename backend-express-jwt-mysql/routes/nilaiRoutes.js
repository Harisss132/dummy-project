const express = require('express');
const router = express.Router();
const nilaiController = require('../controllers/nilaiController');
const auth = require('../middleware/auth');
const { validateNilaiCreate, validateNilaiUpdate } = require('../middleware/validation');

router.get('/', nilaiController.getAll); // public
router.get('/:id', nilaiController.getById); // public
router.post('/', auth, validateNilaiCreate, nilaiController.create); // protected
router.put('/:id', auth, validateNilaiUpdate, nilaiController.update); // protected
router.delete('/:id', auth, nilaiController.remove); // protected

module.exports = router;
