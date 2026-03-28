const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventMaster API',
      version: '1.0.0',
    },
    servers: [
      {
        // Tu URL real de Vercel
        url: 'https://event-master-eight.vercel.app/api', 
        description: 'Servidor Producción'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    // El '../' es LA CLAVE. Sube de 'config' a 'src', y entra a 'docs'
    path.join(__dirname, '../docs/*.yaml'),
  ],
};

module.exports = swaggerJsdoc(options);