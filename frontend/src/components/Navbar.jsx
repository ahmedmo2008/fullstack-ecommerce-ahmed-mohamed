import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-bone/95 backdrop-blur border-b border-ink/10">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="focus-ring font-display text-xl tracking-tight text-ink">
          Aterra
        </Link>

        <div className="hidden md:flex items-center gap-8 font-body text-sm">
          <Link to="/products" className="focus-ring hover:text-brass transition-colors">
            Shop
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="focus-ring hover:text-brass transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-5 font-body text-sm">
          <Link to="/cart" className="focus-ring relative hover:text-brass transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-rust text-bone text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="focus-ring hover:text-brass transition-colors">
                {user.name?.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="focus-ring hover:text-brass transition-colors">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="focus-ring hover:text-brass transition-colors">
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
