const Place = require('../../models/places');
const Event = require('../../models/events');

const getAvailabilityPlaceController = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query; // ?date=2026-04-10 (ISO date, checks full day)

        const place = await Place.findById(id).select('-__v');
        if (!place) return res.status(404).json({ msg: 'Sede no encontrada' });

        // Busca eventos activos en esa sede para la fecha solicitada
        const query = {
            location: place.name,
            status: { $nin: ['cancelled'] }
        };

        if (date) {
            const dayStart = new Date(date);
            dayStart.setUTCHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setUTCHours(23, 59, 59, 999);
            query.$or = [
                { startTime: { $gte: dayStart, $lte: dayEnd } },
                { endTime: { $gte: dayStart, $lte: dayEnd } },
                { startTime: { $lte: dayStart }, endTime: { $gte: dayEnd } }
            ];
        }

        const events = await Event.find(query).select('title startTime endTime status').sort({ startTime: 1 });

        res.json({
            place,
            date: date || 'todas las fechas',
            totalEvents: events.length,
            events
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { getAvailabilityPlaceController };
