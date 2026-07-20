import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl mb-10">Create an account</h1>

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
          <label htmlFor="email" className="font-body text-sm block mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="focus-ring w-full border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="font-body text-sm block mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="focus-ring w-full border border-ink/20 px-4 py-2 bg-transparent font-body text-sm"
          />
        </div>

        {error && <p className="font-body text-sm text-rust">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full bg-ink text-bone px-7 py-3 font-body text-sm hover:bg-brass hover:text-ink transition-colors disabled:opacity-40"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="font-body text-sm text-ink/60 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="focus-ring text-brass hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
