require('dotenv').config(); 
const express = require('express');
const connectDB = require('./src/config/dataBase'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

connectDB(); 
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/event', require('./src/routes/eventRoutes'));
app.use('/api/places', require('./src/routes/placesRoutes'));
app.use('/api/reservations', require('./src/routes/reservationsRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto:  ${PORT}`));