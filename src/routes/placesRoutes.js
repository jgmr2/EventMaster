const { Router } = require('express');
const router = Router();

const { getAllPlacesController } = require('../controllers/places/getAllPlacesController');
const { createPlaceController } = require('../controllers/places/createPlaceController');
const { getAvailabilityPlaceController } = require('../controllers/places/getAvailabilityPlaceController');

const checkAuth = require('../middlewares/global');
const checkRole = require('../middlewares/checkRole');

// =======================
// Rutas Públicas
// =======================
router.get('/', getAllPlacesController);
router.get('/:id/availability', getAvailabilityPlaceController);

// =======================
// Rutas Privadas (Solo Admin)
// =======================
router.post('/', checkAuth, checkRole('admin'), createPlaceController);

module.exports = router;
