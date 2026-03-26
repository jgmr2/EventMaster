const Event = require('../../models/events');

const showIdEventController = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).select('-__v').populate('createdBy', 'name');
        return event ? res.json(event) : res.status(404).json({ msg: 'No encontrado' });
    } catch (e) {
        res.status(400).json({ msg: 'ID no válido' });
    }
};

module.exports = { showIdEventController };