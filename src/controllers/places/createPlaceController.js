const Place = require('../../models/places');

const createPlaceController = async (req, res) => {
    try {
        const { 
            name, 
            address, 
            location, 
            defaultZones, 
            maxCapacity, 
            contactPhone, 
            amenities 
        } = req.body;

        const existingPlace = await Place.findOne({ name });
        if (existingPlace) {
            return res.status(400).json({ 
                msg: 'Ya existe una sede con ese nombre' 
            });
        }

        if (defaultZones && defaultZones.length > 0) {
            const zonesTotalCapacity = defaultZones.reduce((acc, zone) => acc + zone.capacity, 0);
            if (zonesTotalCapacity > maxCapacity) {
                return res.status(400).json({ 
                    msg: 'La capacidad total de las zonas excede la capacidad máxima de la sede' 
                });
            }
        }

        const newPlace = new Place({
            name,
            address,
            location,
            defaultZones,
            maxCapacity,
            contactPhone,
            amenities
        });

        await newPlace.save();

        res.status(201).json({
            msg: 'Sede creada exitosamente',
            place: newPlace
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            msg: 'Hubo un error al crear la sede',
            error: error.message 
        });
    }
};

module.exports = { createPlaceController };