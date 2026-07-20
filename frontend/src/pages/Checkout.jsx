import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/endpoints';
import LoadingState from '../components/LoadingState';

export default function Checkout() {
  const { cart, isLoading } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  if (isLoading) return <LoadingState label="Loading checkout" />;

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);

    try {
      await orderApi.create({ shippingAddress });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place your order.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-10">Checkout</h1>

      <div className="border border-ink/10 p-5 mb-8">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm">Order total</p>
          <p className="font-mono text-lg">${cart.total.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="shippingAddress" className="font-body text-sm block mb-2">
            Shipping address
          </label>
          <textarea
            id="shippingAddress"
            required
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="focus-ring w-full border border-ink/20 px-4 py-3 bg-transparent font-body text-sm"
          />
        </div>

        {error && <p className="font-body text-sm text-rust">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="focus-ring w-full bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors disabled:opacity-40"
        >
          {placing ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
