const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CoopConnect API',
      version: '1.0.0',
      description: `
        The CoopConnect API allows cooperatives and members to register, 
        manage profiles, post announcements, and track contributions.
        
        ### Features
        - User authentication with JWT
        - Cooperative management (CRUD)
        - Posts and contributions (coming in Week 6)
        - Secure endpoints using bearer tokens
      `,
      contact: {
        name: 'CoopConnect Team',
        email: 'team@coopconnect.com',
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained after login',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // 👇 Scans all route files for Swagger annotations
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
