import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '../api/endpoints';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function Home() {
  const featuredQuery = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.list({ limit: 4, sortBy: 'createdAt', order: 'desc' }),
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
  });

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-brass text-sm mb-4">Est. for people who keep things</p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink mb-6">
            Objects made to be used, not replaced.
          </h1>
          <p className="font-body text-ink/70 text-base max-w-md mb-8">
            Aterra sources stoneware, linen, forged tools and hand-blown lighting from makers
            who build for decades, not seasons.
          </p>
          <Link
            to="/products"
            className="focus-ring inline-block bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors"
          >
            Browse the shop
          </Link>
        </div>
        <div className="aspect-square bg-stone/50 flex items-center justify-center">
          <p className="font-display text-stone text-8xl">A</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">New arrivals</h2>
          <Link to="/products" className="focus-ring font-body text-sm text-brass hover:underline">
            View all
          </Link>
        </div>

        {featuredQuery.isLoading && <LoadingState label="Loading products" />}
        {featuredQuery.isError && (
          <ErrorState message="We couldn't load new arrivals." onRetry={featuredQuery.refetch} />
        )}
        {featuredQuery.data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredQuery.data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {categoriesQuery.data?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl text-ink mb-8">Shop by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoriesQuery.data.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="focus-ring border border-ink/10 px-5 py-6 text-center hover:border-brass transition-colors"
              >
                <p className="font-body text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
