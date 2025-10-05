require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user');
const Cooperative = require('./models/cooperative');

const clearData = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    await User.deleteMany();
    await Cooperative.deleteMany();

    console.log('🗑️  All data cleared successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clearData();
