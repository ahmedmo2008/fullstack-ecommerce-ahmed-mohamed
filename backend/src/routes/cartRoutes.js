const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require('../controllers/cartController');

const router = express.Router();

router.use(requireAuth);

router.get('/', getCart);

router.post(
  '/items',
  [
    body('productId').notEmpty().withMessage('productId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
  ],
  validate,
  addToCart
);

router.put(
  '/items/:itemId',
  [body('quantity').isInt({ min: 1 }).withMessage('quantity must be a positive integer')],
  validate,
  updateCartItem
);

router.delete('/items/:itemId', removeCartItem);

module.exports = router;
