const { Router } = require('express');
const router = Router();
const {showAllEventsController} = require('../controllers/event/showAllEventsController');
const {createEventController} = require('../controllers/event/createEventController');
const checkAuth = require('../middlewares/global');





// =======================
// Rutas Públicas
// =======================
router.get('/',showAllEventsController);

// =======================
// Rutas Privadas
// =======================
// Agregamos checkAuth como puente entre la petición y el controlador
//router.get('/me', checkAuth, meController); 
router.post('/new',checkAuth, createEventController)

module.exports = router;