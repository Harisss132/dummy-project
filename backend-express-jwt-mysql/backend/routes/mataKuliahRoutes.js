const express = require('express');
const router = express.Router();
const mataKuliahController = require('../controllers/mataKuliahController.js');
const auth = require('../middleware/auth.js');
const { validateMataKuliahCreate, validateMataKuliahUpdate } = require('../middleware/validation.js');

router.get('/', mataKuliahController.getAll); // public
router.get('/:id', mataKuliahController.getById); // public
router.post('/', auth, validateMataKuliahCreate, mataKuliahController.create); // protected
router.put('/:id', auth, validateMataKuliahUpdate, mataKuliahController.update); // protected
router.delete('/:id', auth, mataKuliahController.remove); // protected

module.exports = router;
