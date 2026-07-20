import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-32 text-center">
      <p className="font-mono text-brass text-sm mb-4">404</p>
      <h1 className="font-display text-3xl mb-4">This page has been discontinued</h1>
      <p className="font-body text-ink/60 mb-8">
        The page you're looking for isn't here. It may have moved, or never existed.
      </p>
      <Link to="/" className="focus-ring underline decoration-brass underline-offset-4">
        Back to Aterra
      </Link>
    </div>
  );
}
