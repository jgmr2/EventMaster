const Reservation = require('../../models/reservations');
const Event = require('../../models/events');

const eventReservationsController = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId).select('title zones totalCapacity status');
        if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });

        const reservations = await Reservation.find({ event: eventId })
            .populate('user', 'name email')
            .select('-__v')
            .sort({ createdAt: -1 });

        // Reporte de ocupación por zona
        const zonesReport = event.zones.map(zone => ({
            name: zone.name,
            capacity: zone.capacity,
            occupied: zone.occupied,
            available: zone.capacity - zone.occupied,
            price: zone.price
        }));

        const totalActive = reservations.filter(r => r.status === 'active').length;
        const totalCheckedIn = reservations.filter(r => r.checkedIn).length;

        res.json({
            event: { _id: event._id, title: event.title, status: event.status },
            summary: {
                totalCapacity: event.totalCapacity,
                totalActive,
                totalCheckedIn,
                totalCancelled: reservations.length - totalActive
            },
            zonesReport,
            reservations
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { eventReservationsController };
