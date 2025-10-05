const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CoopConnect API',
      version: '1.0.0',
      description: 'API for cooperatives, users, posts, and contributions',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // This makes Swagger show "Authorize" with JWT
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply globally if you want
      },
    ],
  },
  apis: ['./routes/*.js'], // Swagger will scan routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
