require('dotenv').config();

const app = require('../src/app');
const connectMongo = require('../src/config/mongo');

module.exports = async (req, res) => {
  try {
    await connectMongo();
  } catch (err) {
    console.error('MongoDB connection failed for this request:', err.message);
  }

  return app(req, res);
};