const { Router } = require('express');
const router = Router();

const { createReservationController } = require('../controllers/reservations/createReservationController');
const { myTicketsController } = require('../controllers/reservations/myTicketsController');
const { cancelReservationController } = require('../controllers/reservations/cancelReservationController');
const { checkInReservationController } = require('../controllers/reservations/checkInReservationController');
const { eventReservationsController } = require('../controllers/reservations/eventReservationsController');

const checkAuth = require('../middlewares/global');
const checkRole = require('../middlewares/checkRole');

// =======================
// Rutas privadas (User)
// =======================
router.post('/', checkAuth, checkRole('user', 'admin', 'organizer'), createReservationController);
router.get('/my-tickets', checkAuth, myTicketsController);
router.delete('/:id', checkAuth, cancelReservationController);

// =======================
// Rutas privadas (Staff/Admin - Check-in)
// =======================
router.patch('/:id/check-in', checkAuth, checkRole('staff', 'admin'), checkInReservationController);

// =======================
// Rutas privadas (Admin/Organizer/Artist - Reportes)
// =======================
router.get('/event/:eventId', checkAuth, checkRole('admin', 'organizer', 'artist'), eventReservationsController);

module.exports = router;
