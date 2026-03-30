const { Schema, model } = require('mongoose');

const PlaceSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    defaultZones: [{
        name: { type: String, required: true },
        capacity: { type: Number, required: true },
        description: String
    }],
    maxCapacity: { type: Number, required: true },
    contactPhone: String,
    amenities: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


PlaceSchema.index({ location: '2dsphere' });

module.exports = model('Place', PlaceSchema);