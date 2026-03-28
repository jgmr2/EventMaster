require('dotenv').config(); 
const express = require('express');
const connectDB = require('./src/config/dataBase'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

connectDB(); 
app.use(express.json());

// --- EL TRUCO MAESTRO PARA EVITAR ERRORES 404 EN VERCEL ---
// Interceptamos las peticiones locales y las redirigimos a los CDNs oficiales
app.get('/api-docs/swagger-ui-bundle.js', (req, res) => res.redirect('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js'));
app.get('/api-docs/swagger-ui-standalone-preset.js', (req, res) => res.redirect('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'));
app.get('/api-docs/swagger-ui.css', (req, res) => res.redirect('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'));

// --- CONFIGURACIÓN PARA SWAGGER ---
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const JS_URL = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js"
];

app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, { 
        customCssUrl: CSS_URL,
        customJs: JS_URL,
        customSiteTitle: "EventMaster API Docs"
    })
);
// ------------------------------------------------------

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/event', require('./src/routes/eventRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto:  ${PORT}`));