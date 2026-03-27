const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // El Pool: Mantén 100 conexiones abiertas y listas
            maxPoolSize: 100, 
            // Mínimo: No destruyas todas las conexiones, deja 10 siempre "calientes"
            minPoolSize: 10,
            // Timeouts: Evita que el servidor se quede zombi si la DB no responde rápido
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Conectado [Pool Size: 100]');
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;