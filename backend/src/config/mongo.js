const mongoose = require('mongoose');

let cachedConnection = null;

async function connectMongo() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  cachedConnection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  return cachedConnection;
}

module.exports = connectMongo;