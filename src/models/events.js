const { Schema, model } = require('mongoose');

const EventSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: String,
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['draft', 'published', 'suspended', 'cancelled', 'completed'], 
        default: 'published' 
    },
    zones: [{
        name: { type: String, required: true },
        capacity: { type: Number, required: true },
        occupied: { type: Number, default: 0 },
        price: { type: Number, default: 0 }
    }],
    totalCapacity: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

EventSchema.index({ location: 1, startTime: 1, endTime: 1 });

module.exports = model('Event', EventSchema);