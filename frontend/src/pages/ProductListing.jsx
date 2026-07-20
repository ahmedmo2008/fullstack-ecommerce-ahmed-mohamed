import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '../api/endpoints';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const page = Number(searchParams.get('page')) || 1;

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });

  const productsQuery = useQuery({
    queryKey: ['products', { search, category, sortBy, order, page }],
    queryFn: () => productApi.list({ search, category, sortBy, order, page, limit: 12 }),
    keepPreviousData: true,
  });

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-10">All products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={search}
          onKeyDown={(e) => e.key === 'Enter' && updateParam('search', e.target.value)}
          onBlur={(e) => updateParam('search', e.target.value)}
          className="focus-ring flex-1 border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
        />

        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="focus-ring border border-ink/20 px-4 py-2 bg-bone font-body text-sm"
        >
          <option value="">All categories</option>
          {categoriesQuery.data?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const [nextSort, nextOrder] = e.target.value.split('-');
            const next = new URLSearchParams(searchParams);
            next.set('sortBy', nextSort);
            next.set('order', nextOrder);
            next.delete('page');
            setSearchParams(next);
          }}
          className="focus-ring border border-ink/20 px-4 py-2 bg-bone font-body text-sm"
        >
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>

      {productsQuery.isLoading && <LoadingState label="Loading products" />}
      {productsQuery.isError && (
        <ErrorState message="We couldn't load products." onRetry={productsQuery.refetch} />
      )}

      {productsQuery.data && productsQuery.data.products.length === 0 && (
        <p className="font-body text-ink/60 py-16 text-center">No products match your search.</p>
      )}

      {productsQuery.data && productsQuery.data.products.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            {productsQuery.data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 font-mono text-sm">
            <button
              disabled={page <= 1}
              onClick={() => updateParam('page', String(page - 1))}
              className="focus-ring disabled:opacity-30 hover:text-brass"
            >
              Prev
            </button>
            <span>
              Page {productsQuery.data.pagination.page} of {productsQuery.data.pagination.totalPages || 1}
            </span>
            <button
              disabled={page >= productsQuery.data.pagination.totalPages}
              onClick={() => updateParam('page', String(page + 1))}
              className="focus-ring disabled:opacity-30 hover:text-brass"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
