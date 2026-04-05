const { Router } = require('express');
const router = Router();
const { registerController } = require('../controllers/auth/registerController');
const { loginController } = require('../controllers/auth/loginController');
const { meController } = require('../controllers/auth/meController');
const { createManagedAccountController } = require('../controllers/auth/createManagedAccountController');
const checkAuth = require('../middlewares/global');
const checkRole = require('../middlewares/checkRole');





// =======================
// Rutas Públicas
// =======================
router.post('/register', registerController); 
router.post('/login', loginController); 

// =======================
// Rutas Privadas
// =======================
// Agregamos checkAuth como puente entre la petición y el controlador
router.get('/me', checkAuth, meController); 

// Solo admin puede crear cuentas operativas (staff/artist)
router.post('/admin/create-account', checkAuth, checkRole('admin'), createManagedAccountController);

module.exports = router;