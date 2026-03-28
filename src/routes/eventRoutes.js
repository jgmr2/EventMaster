const { Router } = require('express');
const router = Router();

// Importación de controladores (Asegúrate de crearlos en la carpeta controllers)
const { showAllEventsController } = require('../controllers/event/showAllEventsController');
const { createEventController } = require('../controllers/event/createEventController');
const { showIdEventController } = require('../controllers/event/showIdEventController');
const { updateEventController } = require('../controllers/event/updateEventController'); // Falta crear
//const { deleteEventController } = require('../controllers/event/deleteEventController'); // Falta crear
//const { getAvailabilityEventController } = require('../controllers/event/getAvailabilityEventController'); // Falta crear

const checkAuth = require('../middlewares/global');

// =======================
// Rutas Públicas
// =======================
router.get('/', showAllEventsController);
router.get('/:id', showIdEventController);
//router.get('/:id/availability', getAvailabilityEventController); // Nueva pública

// =======================
// Rutas Privadas (Admin/Organizer)
// =======================
router.post('/new', checkAuth, createEventController);
router.patch('/:id', checkAuth, updateEventController);   // Nueva privada
//router.delete('/:id', checkAuth, deleteEventController);  // Nueva privada

module.exports = router;