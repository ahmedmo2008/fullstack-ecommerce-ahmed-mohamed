import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../api/endpoints';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });

  async function handleCreate(e) {
    e.preventDefault();
    setError('');

    try {
      await categoryApi.create({ name });
      setName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create category.');
    }
  }

  async function handleDelete(id) {
    try {
      await categoryApi.remove(id);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this category.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Manage categories</h1>
        <Link to="/admin" className="focus-ring font-body text-sm hover:text-brass">
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleCreate} className="flex gap-4 mb-10">
        <input
          type="text"
          placeholder="New category name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus-ring flex-1 border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
        />
        <button
          type="submit"
          className="focus-ring bg-ink text-bone px-6 py-2 font-body text-sm hover:bg-brass hover:text-ink transition-colors"
        >
          Add
        </button>
      </form>

      {error && <p className="font-body text-sm text-rust mb-6">{error}</p>}

      {categoriesQuery.isLoading && <LoadingState label="Loading categories" />}
      {categoriesQuery.isError && <ErrorState message="We couldn't load categories." onRetry={categoriesQuery.refetch} />}

      {categoriesQuery.data && (
        <ul className="divide-y divide-ink/10">
          {categoriesQuery.data.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between py-4 font-body text-sm">
              <span>
                {cat.name} <span className="font-mono text-xs text-ink/40">({cat._count.products})</span>
              </span>
              <button onClick={() => handleDelete(cat.id)} className="focus-ring text-rust hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
