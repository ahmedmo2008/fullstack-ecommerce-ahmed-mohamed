const Review = require('../models/Review');

async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, averageRating: Number(avgRating.toFixed(2)), count: reviews.length });
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You cannot delete this review' });
    }

    await Review.findByIdAndDelete(id);

    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProductReviews, createReview, deleteReview };
