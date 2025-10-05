require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user');
const Cooperative = require('./models/cooperative');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    role: 'member'
  }
];

const cooperatives = [
  {
    name: 'Farmers Union',
    description: 'A cooperative for local farmers',
    location: 'Calabar'
  },
  {
    name: 'Tech Co-op',
    description: 'A cooperative for software developers',
    location: 'Lagos'
  }
];

const seedData = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    await User.deleteMany();
    await Cooperative.deleteMany();

    // create users one by one so pre-save hook hashes passwords
    const createdUsers = [];
    for (let user of users) {
      const newUser = await User.create(user);
      createdUsers.push(newUser);
    }

    // assign createdBy to admin
    cooperatives[0].createdBy = createdUsers[0]._id;
    cooperatives[1].createdBy = createdUsers[0]._id;

    await Cooperative.insertMany(cooperatives);

    console.log('✅ Data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
