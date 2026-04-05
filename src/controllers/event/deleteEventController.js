const Event = require('../../models/events');

const deleteEventController = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });

        if (event.status === 'cancelled') {
            return res.status(400).json({ msg: 'El evento ya está cancelado' });
        }

        event.status = 'cancelled';
        await event.save();

        res.json({ msg: 'Evento cancelado correctamente', event });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { deleteEventController };
