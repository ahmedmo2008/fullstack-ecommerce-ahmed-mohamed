import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from '../../api/endpoints';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { resolveImageUrl } from '../../utils/image';

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '', image: null };

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.list({ limit: 100 }),
  });

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      image: null,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('stock', form.stock);
    data.append('categoryId', form.categoryId);
    if (form.image) data.append('image', form.image);

    try {
      if (editingId) {
        await productApi.update(editingId, data);
      } else {
        await productApi.create(data);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this product.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await productApi.remove(id);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this product.');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Manage products</h1>
        <Link to="/admin" className="focus-ring font-body text-sm hover:text-brass">
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="border border-ink/10 p-6 mb-12 grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="focus-ring border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
        />
        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          className="focus-ring border border-ink/20 px-4 py-2 bg-bone font-body text-sm"
        >
          <option value="">Select category</option>
          {categoriesQuery.data?.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          required
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="focus-ring border border-ink/20 px-4 py-2 bg-transparent font-mono text-sm"
        />
        <input
          type="number"
          placeholder="Stock"
          required
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          className="focus-ring border border-ink/20 px-4 py-2 bg-transparent font-mono text-sm"
        />
        <textarea
          placeholder="Description"
          required
          rows={2}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="focus-ring md:col-span-2 border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] }))}
          className="focus-ring font-body text-sm"
        />

        {error && <p className="md:col-span-2 font-body text-sm text-rust">{error}</p>}

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring bg-ink text-bone px-6 py-2 font-body text-sm hover:bg-brass hover:text-ink transition-colors disabled:opacity-40"
          >
            {submitting ? 'Saving...' : editingId ? 'Update product' : 'Create product'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="focus-ring font-body text-sm text-ink/60 hover:text-ink">
              Cancel
            </button>
          )}
        </div>
      </form>

      {productsQuery.isLoading && <LoadingState label="Loading products" />}
      {productsQuery.isError && <ErrorState message="We couldn't load products." onRetry={productsQuery.refetch} />}

      {productsQuery.data && (
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left border-b border-ink/10 text-ink/50 text-xs">
              <th className="py-3">Image</th>
              <th className="py-3">Name</th>
              <th className="py-3">Category</th>
              <th className="py-3">Price</th>
              <th className="py-3">Stock</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {productsQuery.data.products.map((product) => {
              const imageUrl = resolveImageUrl(product.imageUrl);
              return (
                <tr key={product.id} className="border-b border-ink/5">
                  <td className="py-3">
                    <div className="w-12 h-12 bg-stone/40">
                      {imageUrl && <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="py-3">{product.name}</td>
                  <td className="py-3">{product.category?.name}</td>
                  <td className="py-3 font-mono">${Number(product.price).toFixed(2)}</td>
                  <td className="py-3 font-mono">{product.stock}</td>
                  <td className="py-3 text-right space-x-4">
                    <button onClick={() => startEdit(product)} className="focus-ring text-brass hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="focus-ring text-rust hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
