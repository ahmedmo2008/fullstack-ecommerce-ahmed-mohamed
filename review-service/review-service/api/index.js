require('dotenv').config();
const app = require('../src/app');
const connectMongo = require('../src/config/mongo');

let connected = false;

module.exports = async (req, res) => {
  if (!connected) {
    await connectMongo();
    connected = true;
  }
  return app(req, res);
};
