const { Schema, model } = require('mongoose');

const ReservationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    zone: { type: String, required: true, trim: true },
    qrCode: { type: String, unique: true },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    checkedIn: { type: Boolean, default: false }
}, { timestamps: true });

ReservationSchema.pre('save', async function () {
    if (!this.qrCode) {
        const { randomUUID } = require('crypto');
        this.qrCode = randomUUID();
    }
});

module.exports = model('Reservation', ReservationSchema);
