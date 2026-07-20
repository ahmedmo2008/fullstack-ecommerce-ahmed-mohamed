const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getStoreStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/', requireAuth, requireRole('ADMIN'), getStoreStats);

module.exports = router;
