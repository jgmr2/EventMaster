const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); // Importante importar path

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventMaster API',
      version: '1.0.0',
    },
    servers: [
      {
        // Agrega tu URL de Vercel aquí
        url: 'https://tu-proyecto.vercel.app/api', 
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
    // Usamos path.join para que Vercel encuentre los archivos YAML
    path.join(__dirname, './docs/*.yaml'),
  ],
};

module.exports = swaggerJsdoc(options);