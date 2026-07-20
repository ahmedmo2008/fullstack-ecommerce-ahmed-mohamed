const Review = require('../../src/models/Review');

describe('Review model', () => {
  afterEach(async () => {
    await Review.deleteMany({});
  });

  it('saves a valid review to MongoDB', async () => {
    const review = await Review.create({
      productId: 'product-1',
      userId: 'user-1',
      userName: 'Test User',
      rating: 5,
      comment: 'Beautifully made.',
    });

    expect(review._id).toBeDefined();
    expect(review.rating).toBe(5);
  });

  it('rejects a rating outside 1-5', async () => {
    await expect(
      Review.create({
        productId: 'product-1',
        userId: 'user-1',
        userName: 'Test User',
        rating: 9,
        comment: 'Too high',
      })
    ).rejects.toThrow();
  });

  it('rejects a review without a comment', async () => {
    await expect(
      Review.create({
        productId: 'product-1',
        userId: 'user-1',
        userName: 'Test User',
        rating: 4,
      })
    ).rejects.toThrow();
  });
});
