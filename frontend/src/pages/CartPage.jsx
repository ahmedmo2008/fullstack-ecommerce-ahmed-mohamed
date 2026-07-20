import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PriceTag from '../components/PriceTag';
import { resolveImageUrl } from '../utils/image';

export default function CartPage() {
  const { cart, isLoading, isError, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (isLoading) return <LoadingState label="Loading your cart" />;
  if (isError) return <ErrorState message="We couldn't load your cart." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <p className="font-body text-ink/60 mb-8">Find something worth keeping.</p>
        <Link
          to="/products"
          className="focus-ring inline-block bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-10">Your cart</h1>

      <ul className="divide-y divide-ink/10 mb-10">
        {cart.items.map((item) => {
          const imageUrl = resolveImageUrl(item.product.imageUrl);
          return (
            <li key={item.id} className="flex items-center gap-6 py-6">
              <div className="w-24 h-24 bg-stone/40 flex-shrink-0 overflow-hidden">
                {imageUrl && <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />}
              </div>

              <div className="flex-1">
                <Link to={`/products/${item.product.id}`} className="focus-ring font-body text-sm hover:text-brass">
                  {item.product.name}
                </Link>
                <PriceTag price={item.product.price} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => updateItem({ itemId: item.id, quantity: Math.max(1, Number(e.target.value)) })}
                  className="focus-ring w-16 border border-ink/20 px-2 py-1 bg-transparent font-mono text-sm"
                />
              </div>

              <p className="font-mono text-sm w-20 text-right">
                ${(Number(item.product.price) * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="focus-ring font-body text-xs text-rust hover:underline"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-ink/20 pt-6">
        <p className="font-display text-xl">Total</p>
        <p className="font-mono text-2xl">${cart.total.toFixed(2)}</p>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="focus-ring mt-8 w-full bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors"
      >
        Proceed to checkout
      </button>
    </div>
  );
}
