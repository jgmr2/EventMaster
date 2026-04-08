require('dotenv').config(); 
const express = require('express');
const connectDB = require('./src/config/dataBase'); 
const ensureAdminUser = require('./src/config/seedAdmin');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

// CORS nativo para permitir cualquier origen, método y headers en toda la API.
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next();
});

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/event', require('./src/routes/eventRoutes'));
app.use('/api/place', require('./src/routes/placeRoutes'));
app.use('/api/places', require('./src/routes/placesRoutes'));
app.use('/api/reservations', require('./src/routes/reservationsRoutes'));

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
	await connectDB();
	await ensureAdminUser();
	app.listen(PORT, () => console.log(`Servidor en puerto:  ${PORT}`));
};

bootstrap();