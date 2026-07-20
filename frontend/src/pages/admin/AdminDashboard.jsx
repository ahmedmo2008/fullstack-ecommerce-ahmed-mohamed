import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../../api/endpoints';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

export default function AdminDashboard() {
  const statsQuery = useQuery({ queryKey: ['stats'], queryFn: statsApi.get });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Admin dashboard</h1>
        <div className="flex gap-4 font-body text-sm">
          <Link to="/admin/products" className="focus-ring hover:text-brass">Products</Link>
          <Link to="/admin/categories" className="focus-ring hover:text-brass">Categories</Link>
          <Link to="/admin/orders" className="focus-ring hover:text-brass">Orders</Link>
        </div>
      </div>

      {statsQuery.isLoading && <LoadingState label="Loading statistics" />}
      {statsQuery.isError && <ErrorState message="We couldn't load store statistics." onRetry={statsQuery.refetch} />}

      {statsQuery.data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {[
              ['Customers', statsQuery.data.totalCustomers],
              ['Products', statsQuery.data.totalProducts],
              ['Orders', statsQuery.data.totalOrders],
              ['Revenue', `$${statsQuery.data.totalRevenue.toFixed(2)}`],
              ['Reviews', statsQuery.data.totalReviews],
            ].map(([label, value]) => (
              <div key={label} className="border border-ink/10 p-5">
                <p className="font-mono text-2xl mb-1">{value}</p>
                <p className="font-body text-xs text-ink/50">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-xl mb-4">Top products</h2>
              <ul className="divide-y divide-ink/10">
                {statsQuery.data.topProducts.map((p) => (
                  <li key={p.productId} className="flex justify-between py-3 font-body text-sm">
                    <span>{p.name}</span>
                    <span className="font-mono text-ink/50">{p.unitsSold} sold</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl mb-4">Recent activity</h2>
              <ul className="divide-y divide-ink/10">
                {statsQuery.data.recentActivity.map((log) => (
                  <li key={log._id} className="py-3 font-body text-sm">
                    <span className="font-mono text-xs text-brass mr-2">{log.action}</span>
                    <span className="text-ink/50 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
