const {Router} = require ('express');
const router = Router();

const{registerController} = require('../controllers/auth/registerController');
const{loginController} = require('../controllers/auth/loginController');
const{meController} = require('../controllers/auth/meController');
const{logoutController} = require('../controllers/auth/logoutController');

//rutas publicas
router.get('/register',registerController); 
router.get('/login',loginController); 
router.get('/me',meController); 
router.get('/logout',logoutController); 
router.get('/prueba',logoutController); 
router.get('/prueba2',logoutController); 
//rutas privadas

module.exports = router;
