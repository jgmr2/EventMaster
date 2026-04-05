const Reservation = require('../../models/reservations');
const Event = require('../../models/events');

const cancelReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, _id: userId } = req.usuario;

        const reservation = await Reservation.findById(id);
        if (!reservation) return res.status(404).json({ msg: 'Reserva no encontrada' });

        if (reservation.status === 'cancelled') {
            return res.status(400).json({ msg: 'La reserva ya está cancelada' });
        }

        // Solo el propietario o un admin pueden cancelar
        const isOwner = reservation.user.toString() === userId.toString();
        if (!isOwner && role !== 'admin') {
            return res.status(403).json({ msg: 'No tienes permisos para cancelar esta reserva' });
        }

        // Liberar cupo en la zona del evento de forma atómica
        await Event.findOneAndUpdate(
            { _id: reservation.event, 'zones.name': reservation.zone },
            { $inc: { 'zones.$.occupied': -1 } }
        );

        reservation.status = 'cancelled';
        await reservation.save();

        res.json({ msg: 'Reserva cancelada y cupo liberado', reservation });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { cancelReservationController };
