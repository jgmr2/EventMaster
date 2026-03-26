const Event = require('../../models/events');
const showAllEventsController = async (req, res) => {
    try {
        res.json(await Event.find().select('-__v').sort({ startTime: 1 }).populate('createdBy', 'name'));
    } catch (e) {
        res.status(500).json({ msg: 'Error al obtener los eventos' });
    }
};
module.exports = { showAllEventsController };