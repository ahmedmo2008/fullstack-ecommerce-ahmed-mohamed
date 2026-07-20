require('dotenv').config();

const app = require('./app');
const connectMongo = require('./config/mongo');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
