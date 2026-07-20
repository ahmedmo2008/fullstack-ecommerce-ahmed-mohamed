import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';
import { resolveImageUrl } from '../utils/image';

export default function ProductCard({ product }) {
  const imageUrl = resolveImageUrl(product.imageUrl);

  return (
    <Link
      to={`/products/${product.id}`}
      className="focus-ring group flex flex-col"
    >
      <div className="aspect-[4/5] bg-stone/40 overflow-hidden mb-3 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-stone text-4xl">
            {product.name?.[0]}
          </div>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-ink text-bone text-xs font-mono px-2 py-1">
            Sold out
          </span>
        )}
      </div>
      <h3 className="font-body text-sm text-ink mb-1 group-hover:text-brass transition-colors">
        {product.name}
      </h3>
      <PriceTag price={product.price} />
    </Link>
  );
}
