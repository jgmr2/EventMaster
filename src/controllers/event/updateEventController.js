const Event = require('../../models/events');

const updateEventController = async (req, res) => {
    try {
        const { id } = req.params;
        const { location: l, startTime: s, endTime: en } = req.body;
        const e = await Event.findById(id);

        if (!e) return res.status(404).json({ msg: 'Evento no encontrado' });

        const [cL, cS, cE] = [l || e.location, s ? new Date(s) : e.startTime, en ? new Date(en) : e.endTime];
        
        const busy = (l || s || en) 
            ? await Event.findOne({ _id: { $ne: id }, location: cL, $or: [{ startTime: { $lt: cE }, endTime: { $gt: cS } }] }) 
            : null;

        return busy 
            ? res.status(400).json({ msg: `El lugar '${cL}' está ocupado.` }) 
            : res.status(200).json(await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }));

    } catch (err) {
        res.status(400).json({ msg: 'Error', error: err.message });
    }
};

module.exports = { updateEventController };