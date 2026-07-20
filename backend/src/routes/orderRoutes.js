const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.use(requireAuth);

router.post(
  '/',
  [body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required')],
  validate,
  createOrder
);

router.get('/my', getMyOrders);
router.get('/', requireRole('ADMIN'), getAllOrders);
router.put('/:id/status', requireRole('ADMIN'), updateOrderStatus);

module.exports = router;
