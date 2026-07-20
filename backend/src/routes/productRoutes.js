const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('categoryId').notEmpty().withMessage('Category is required'),
  ],
  validate,
  createProduct
);

router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  upload.single('image'),
  updateProduct
);

router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProduct);

module.exports = router;
