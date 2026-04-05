const { Router } = require('express');
const router = Router();

const { showAllEventsController } = require('../controllers/event/showAllEventsController');
const { createEventController } = require('../controllers/event/createEventController');
const { showIdEventController } = require('../controllers/event/showIdEventController');
const { updateEventController } = require('../controllers/event/updateEventController');
const { deleteEventController } = require('../controllers/event/deleteEventController');
const { getAvailabilityEventController } = require('../controllers/event/getAvailabilityEventController');

const checkAuth = require('../middlewares/global');
const checkRole = require('../middlewares/checkRole');

// =======================
// Rutas Públicas
// =======================
router.get('/', showAllEventsController);
router.get('/:id', showIdEventController);
router.get('/:id/availability', getAvailabilityEventController);

// =======================
// Rutas Privadas (Admin/Organizer)
// =======================
router.post('/new', checkAuth, checkRole('admin', 'organizer'), createEventController);
router.patch('/:id', checkAuth, checkRole('admin', 'organizer'), updateEventController);
router.delete('/:id', checkAuth, checkRole('admin', 'organizer'), deleteEventController);

module.exports = router;