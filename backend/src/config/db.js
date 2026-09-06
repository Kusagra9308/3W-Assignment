const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskplanet_social');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // If local MongoDB is not running, we log a warning so the app can handle or fallback
    console.warn('Please ensure MongoDB is running locally or specify MONGO_URI in .env');
  }
};

module.exports = connectDB;
