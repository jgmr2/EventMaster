require('dotenv').config(); 
const express = require('express');
const connectDB = require('./src/config/dataBase'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

connectDB(); 
app.use(express.json());

// --- NUEVA CONFIGURACIÓN PARA SWAGGER EN VERCEL ---
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";

app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, { 
        customCssUrl: CSS_URL,
        customSiteTitle: "EventMaster API Docs"
    })
);
// -------------------------------------------------

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/event', require('./src/routes/eventRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto:  ${PORT}`));