const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventMaster API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
    './src/docs/*.yaml',
  ],
};

module.exports = swaggerJsdoc(options);