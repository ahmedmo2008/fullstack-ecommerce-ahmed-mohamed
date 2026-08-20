require('dotenv').config();
const app = require('./app');
const connectMongo = require('./config/mongo');

const PORT = process.env.PORT || 5001;

async function start() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Review service listening on port ${PORT}`);
  });
}

start();
