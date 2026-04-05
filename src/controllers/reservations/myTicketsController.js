const Reservation = require('../../models/reservations');

const myTicketsController = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.usuario._id })
            .populate('event', 'title location startTime endTime status')
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json(reservations);
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor', error: e.message });
    }
};

module.exports = { myTicketsController };
