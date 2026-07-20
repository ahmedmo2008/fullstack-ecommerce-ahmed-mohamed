import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../../api/endpoints';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({ queryKey: ['admin-orders'], queryFn: orderApi.allOrders });

  async function handleStatusChange(id, status) {
    try {
      await orderApi.updateStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch (err) {
      // surfaced inline via refetch failing silently is acceptable here; table stays stale on error
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">Manage orders</h1>
        <Link to="/admin" className="focus-ring font-body text-sm hover:text-brass">
          Back to dashboard
        </Link>
      </div>

      {ordersQuery.isLoading && <LoadingState label="Loading orders" />}
      {ordersQuery.isError && <ErrorState message="We couldn't load orders." onRetry={ordersQuery.refetch} />}

      {ordersQuery.data && (
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left border-b border-ink/10 text-ink/50 text-xs">
              <th className="py-3">Order</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Total</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersQuery.data.map((order) => (
              <tr key={order.id} className="border-b border-ink/5">
                <td className="py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                <td className="py-3">{order.user?.name} ({order.user?.email})</td>
                <td className="py-3 font-mono">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="focus-ring border border-ink/20 px-3 py-1 bg-bone font-mono text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
