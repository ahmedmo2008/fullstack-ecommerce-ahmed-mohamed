const express = require('express');
const mongoose = require('mongoose');
const prisma = require('../config/prisma');

const router = express.Router();

router.get('/', async (req, res) => {
  const status = { status: 'ok', postgres: 'unknown', mongo: 'unknown' };

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.postgres = 'connected';
  } catch (err) {
    status.postgres = 'disconnected';
    status.status = 'degraded';
  }

  status.mongo = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  if (status.mongo !== 'connected') status.status = 'degraded';

  res.json(status);
});

module.exports = router;
