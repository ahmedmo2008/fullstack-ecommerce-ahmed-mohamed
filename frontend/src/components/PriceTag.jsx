export default function PriceTag({ price, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'text-2xl pl-4' : 'text-sm pl-3';

  return (
    <span className={`price-tag text-ink ${sizeClasses}`}>
      ${Number(price).toFixed(2)}
    </span>
  );
}
