const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const {
  getProductReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/:productId', getProductReviews);

router.post(
  '/:productId',
  requireAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  createReview
);

router.delete('/:id', requireAuth, deleteReview);

module.exports = router;
