const Reservation = require('../../models/reservations');

const checkInReservationController = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
            .populate('user', 'name email')
            .populate('event', 'title startTime endTime status');

        if (!reservation) return res.status(404).json({ msg: 'Reserva no encontrada' });

        if (reservation.status === 'cancelled') {
            return res.status(400).json({ msg: 'La reserva está cancelada' });
        }
        if (reservation.checkedIn) {
            return res.status(400).json({ msg: 'El check-in ya fue realizado para esta reserva' });
        }

        reservation.checkedIn = true;
        await reservation.save();

        res.json({ msg: 'Check-in realizado correctamente', reservation });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { checkInReservationController };
