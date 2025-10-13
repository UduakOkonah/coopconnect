// config/swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CoopConnect API',
      version: '1.0.0',
      description: 'REST API for managing cooperatives, users, posts, and contributions.',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'Dynamic server (auto-updated in production)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // scans route files for Swagger annotations
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
