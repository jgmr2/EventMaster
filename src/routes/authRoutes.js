const { Router } = require('express');
const router = Router();
const { registerController } = require('../controllers/auth/registerController');
const { loginController } = require('../controllers/auth/loginController');
const { meController } = require('../controllers/auth/meController');
const checkAuth = require('../middlewares/global');





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

module.exports = router;