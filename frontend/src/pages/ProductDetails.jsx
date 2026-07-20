import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi, reviewApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PriceTag from '../components/PriceTag';
import { resolveImageUrl } from '../utils/image';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [addStatus, setAddStatus] = useState('idle');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');

  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.get(id),
  });

  const reviewsQuery = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewApi.list(id),
  });

  async function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddStatus('loading');
    try {
      await addItem({ productId: id, quantity });
      setAddStatus('success');
    } catch (err) {
      setAddStatus('error');
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError('');

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await reviewApi.create(id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit your review.');
    }
  }

  if (productQuery.isLoading) return <LoadingState label="Loading product" />;
  if (productQuery.isError) {
    return <ErrorState message="We couldn't find this product." onRetry={productQuery.refetch} />;
  }

  const product = productQuery.data;
  const imageUrl = resolveImageUrl(product.imageUrl);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="aspect-square bg-stone/40 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <p className="font-display text-stone text-8xl">{product.name[0]}</p>
          )}
        </div>

        <div>
          <p className="font-mono text-brass text-xs mb-3">{product.category?.name}</p>
          <h1 className="font-display text-3xl mb-4">{product.name}</h1>
          <PriceTag price={product.price} size="lg" />
          <p className="font-body text-ink/70 mt-6 mb-8 leading-relaxed">{product.description}</p>

          <p className="font-mono text-xs text-ink/50 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : 'Currently sold out'}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="font-body text-sm">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="focus-ring w-20 border border-ink/20 px-3 py-2 bg-transparent font-mono text-sm"
              />
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addStatus === 'loading'}
            className="focus-ring bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors disabled:opacity-40"
          >
            {product.stock === 0
              ? 'Sold out'
              : addStatus === 'loading'
              ? 'Adding...'
              : 'Add to cart'}
          </button>

          {addStatus === 'success' && (
            <p className="font-body text-sm text-sage mt-3">Added to your cart.</p>
          )}
          {addStatus === 'error' && (
            <p className="font-body text-sm text-rust mt-3">Couldn't add this to your cart.</p>
          )}
        </div>
      </div>

      <section className="mt-24 max-w-2xl">
        <h2 className="font-display text-2xl mb-8">Reviews</h2>

        {reviewsQuery.isLoading && <LoadingState label="Loading reviews" />}
        {reviewsQuery.isError && <ErrorState message="We couldn't load reviews." />}

        {reviewsQuery.data && (
          <>
            {reviewsQuery.data.count > 0 ? (
              <p className="font-mono text-sm text-ink/60 mb-6">
                {reviewsQuery.data.averageRating} / 5 average from {reviewsQuery.data.count} review
                {reviewsQuery.data.count === 1 ? '' : 's'}
              </p>
            ) : (
              <p className="font-body text-sm text-ink/50 mb-6">No reviews yet — be the first.</p>
            )}

            <ul className="space-y-6 mb-10">
              {reviewsQuery.data.reviews.map((review) => (
                <li key={review._id} className="border-b border-ink/10 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-sm font-medium">{review.userName}</p>
                    <p className="font-mono text-xs text-brass">{review.rating} / 5</p>
                  </div>
                  <p className="font-body text-sm text-ink/70">{review.comment}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        <form onSubmit={handleReviewSubmit} className="border border-ink/10 p-6">
          <h3 className="font-body text-sm font-medium mb-4">Leave a review</h3>
          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="rating" className="font-body text-sm">
              Rating
            </label>
            <select
              id="rating"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className="focus-ring border border-ink/20 px-3 py-1 bg-transparent font-mono text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            placeholder="Share your thoughts on this piece..."
            required
            rows={3}
            className="focus-ring w-full border border-ink/20 px-4 py-3 bg-transparent font-body text-sm mb-4"
          />
          {reviewError && <p className="font-body text-sm text-rust mb-4">{reviewError}</p>}
          <button
            type="submit"
            className="focus-ring border border-ink px-5 py-2 font-body text-sm hover:bg-ink hover:text-bone transition-colors"
          >
            Submit review
          </button>
        </form>
      </section>
    </div>
  );
}
