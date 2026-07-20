import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/endpoints';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', address: user.address || '', phone: user.phone || '' });
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const updated = await authApi.updateProfile(form);
      updateUser(updated);
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your profile.');
      setStatus('error');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl mb-2">Your profile</h1>
      <p className="font-body text-sm text-ink/50 mb-10">{user?.email}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="font-body text-sm block mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="focus-ring w-full border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
          />
        </div>

        <div>
          <label htmlFor="address" className="font-body text-sm block mb-2">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="focus-ring w-full border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="font-body text-sm block mb-2">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="focus-ring w-full border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
          />
        </div>

        {error && <p className="font-body text-sm text-rust">{error}</p>}
        {status === 'success' && <p className="font-body text-sm text-sage">Profile updated.</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="focus-ring w-full bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors disabled:opacity-40"
        >
          {status === 'loading' ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
