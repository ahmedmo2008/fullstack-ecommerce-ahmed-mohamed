import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl mb-10">Log in</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="font-body text-sm text-ink/60 mt-8">
        New here?{' '}
        <Link to="/register" className="focus-ring text-brass hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
