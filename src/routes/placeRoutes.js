const { Router } = require('express');
const router = Router();

//const { showAllPlacesController } = require('../controllers/place/showAllPlacesController');
const { createPlaceController } = require('../controllers/places/createPlaceController');
//const { showIdPlaceController } = require('../controllers/place/showIdPlaceController');
//const { getPlaceAvailabilityController } = require('../controllers/place/getPlaceAvailabilityController');

const checkAuth = require('../middlewares/global');

router.use(checkAuth);

router.post('/', createPlaceController);
//router.get('/', showAllPlacesController);
//router.get('/:id', showIdPlaceController);
//router.get('/:id/availability', getPlaceAvailabilityController);

module.exports = router;