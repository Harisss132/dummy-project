const { error } = require("console");

module.exports = { 
    validateMahasiswaCreate: (req, res, next) => {
    const {name} = req.body;
    const errors=[];
    if(!name || typeof name !== 'string' || name.trim().length < 2) {
        error.push("Nama wajib minimal 2 karakter");
    }
    if(error.length) return res.status(400).json({errors});
    next();
}, 
    validateMahasiswaUpdate: (req, res, next) => {
    const {name} = req.body;
    const errors=[];
    if(!name || undefined && (typeof name !== 'string' || name.trim().length < 2)) {
        error.push("Jika disertakan, nama wajib minimal 2 karakter");
    }
    if(error.length) return res.status(400).json({errors});
    next();
},
    validateMataKuliahCreate: (req, res, next) => {
    const {name} = req.body;
    const errors=[];
    if(!name || typeof name !== 'string' || name.trim().length < 2) {
        error.push("Nama matkul wajib minimal 2 karakter");
    }
    if(error.length) return res.status(400).json({errors});
    next();
}, 
    validateMataKuliahUpdate: (req, res, next) => {
    const {name} = req.body;
    const errors=[];
    if(!name || undefined && (typeof name !== 'string' || name.trim().length < 2)) {
        error.push("Jika disertakan, nama matkul wajib minimal 2 karakter");
    }
    if(error.length) return res.status(400).json({errors});
    next();
},
    validateNilaiCreate : (req, res, next) => {
        const {name, skor} =  req.body;
        const errors = [];
        if(!name || typeof name !== 'string' || name.trim().length < 1) {
            errors.push('name wajib diisi')
        }
        if(skor !== undefined && (Number.isInteger(skor) || skor < 0 || skor > 100)) {
            errors.push('nilai harus integer dan valid');
        }
        if(error.length) return res.status(400).json({errors});
        next();
},
    validateNilaiUpdate : (req, res, next) => {
        const {name, skor} =  req.body;
        const errors = [];
        if(name !== undefined && (!name || typeof name !== 'string' || name.trim().length < 1)) {
            errors.push('Jika disertakan, name tidak boleh kosong!')
        }
        if(skor !== undefined && (Number.isInteger(skor) || skor < 0 || skor > 100)) {
            errors.push('Jika disertakan, skor harus integer dan valid');
        }
        if(error.length) return res.status(400).json({errors});
        next();
}
}