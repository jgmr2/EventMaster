const Event = require('../../models/events');

const getAvailabilityEventController = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).select('title status zones totalCapacity');
        if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });

        const availability = event.zones.map(zone => ({
            name: zone.name,
            capacity: zone.capacity,
            occupied: zone.occupied,
            available: zone.capacity - zone.occupied,
            price: zone.price
        }));

        const totalAvailable = availability.reduce((sum, z) => sum + z.available, 0);

        res.json({
            eventId: event._id,
            title: event.title,
            status: event.status,
            totalCapacity: event.totalCapacity,
            totalAvailable,
            zones: availability
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { getAvailabilityEventController };
