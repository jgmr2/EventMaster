const Event = require('../../models/events');

const createEventController = async (req, res) => {
    try {
        const { location, startTime, endTime } = req.body;

        // Validar si el lugar ya está ocupado en ese rango de tiempo
        const existe = await Event.findOne({
            location,
            $or: [
                { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
            ]
        });

        if (existe) return res.status(400).json({ msg: `El lugar '${location}' ya está ocupado en ese horario.` });

        // Crear evento inyectando el ID del usuario del token
        const event = new Event({ ...req.body, createdBy: req.usuario._id });
        await event.save();
        
        res.status(201).json(event);
    } catch (e) {
        res.status(400).json({ msg: 'Error al crear', error: e.message });
    }
};

module.exports = { createEventController };