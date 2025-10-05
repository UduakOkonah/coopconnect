# CoopConnect API

CoopConnect is a Node.js + Express API for managing cooperatives, users, posts, and contributions.  
Built for CSE 341 Final Project (BYU-I).

---

## Features
- User registration & authentication (JWT)
- Cooperative management
- CRUD for users, cooperatives, posts, contributions
- MongoDB database with Mongoose
- API documentation with Swagger at `/api-docs`
- Security middleware (Helmet, CORS, bcrypt)

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB connection (local or cloud)
- npm

### Installation

1. Clone repo

git clone https://github.com/<your-team-repo>/CoopConnect.git
cd CoopConnect

2. Install dependencies
npm install

3. Configure environment
Create a .env file in the root folder:


PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://CoopConnnect:Ud7203182003@cluster0.dnlxr0l.mongodb.net/CoopConnectDB?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey
4. Run server

npm run dev   # with nodemon (recommended)
npm start     # normal start


API Documentation
Swagger is available at:
http://localhost:5000/api-docs

Endpoints Overview
Users

POST /api/users - Register a new user

POST /api/users/login - Login a user

GET /api/users - Get all users (protected)

GET /api/users/:id - Get a single user (protected)

PUT /api/users/:id - Update a user (protected)

DELETE /api/users/:id - Delete a user (protected)

Cooperatives

POST /api/cooperatives - Create a new cooperative (protected)

GET /api/cooperatives - Get all cooperatives

GET /api/cooperatives/:id - Get one cooperative

PUT /api/cooperatives/:id - Update a cooperative (protected)

DELETE /api/cooperatives/:id - Delete a cooperative (protected, admin only)


Team Roles:
Uduakobong Okonah: Users & Posts CRUD, repo setup, MongoDB setup, Render Deployment Swagger docs for users & posts

Emmanuel Ndem: Cooperatives & Contributions CRUD, , Swagger docs for coops & contributions

Both: JWT authentication, testing, video presentation

Deployment

The app is deployed on Render:
[App](https://yourapp.onrender.com)

Swagger docs are available at:
[Swagger Doc](https://coopconnect.onrender.com/api-docs)

License
MIT