const Place = require('../../models/places');

const getAllPlacesController = async (req, res) => {
    try {
        const places = await Place.find().select('-__v').sort({ name: 1 });
        res.json(places);
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { getAllPlacesController };
