const Event = require('../../models/events');
const Reservation = require('../../models/reservations');

const createReservationController = async (req, res) => {
    try {
        const { eventId, zone } = req.body;

        if (!eventId || !zone) {
            return res.status(400).json({ msg: 'eventId y zone son obligatorios' });
        }

        // Verificar que el evento existe y está activo
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });
        if (['cancelled', 'completed'].includes(event.status)) {
            return res.status(400).json({ msg: 'El evento no acepta reservas en su estado actual' });
        }

        // Verificar zona y capacidad disponible
        const targetZone = event.zones.find(z => z.name === zone);
        if (!targetZone) {
            return res.status(404).json({ msg: `Zona '${zone}' no encontrada en el evento` });
        }
        if (targetZone.occupied >= targetZone.capacity) {
            return res.status(400).json({ msg: `Sin disponibilidad en la zona '${zone}'` });
        }

        // Incremento atómico con control de concurrencia optimista:
        // Solo actualiza si occupied no cambió desde que lo leímos (evita overbooking).
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                zones: { $elemMatch: { name: zone, occupied: targetZone.occupied } }
            },
            { $inc: { 'zones.$.occupied': 1 } },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(400).json({ msg: `Sin disponibilidad en la zona '${zone}' (cupo agotado)` });
        }

        const reservation = new Reservation({
            user: req.usuario._id,
            event: eventId,
            zone
        });
        await reservation.save();

        res.status(201).json(reservation);
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { createReservationController };
