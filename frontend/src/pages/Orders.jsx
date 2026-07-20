import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/endpoints';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function Orders() {
  const ordersQuery = useQuery({ queryKey: ['orders', 'my'], queryFn: orderApi.myOrders });

  if (ordersQuery.isLoading) return <LoadingState label="Loading your orders" />;
  if (ordersQuery.isError) {
    return <ErrorState message="We couldn't load your orders." onRetry={ordersQuery.refetch} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-10">Your orders</h1>

      {ordersQuery.data.length === 0 ? (
        <p className="font-body text-ink/60">You haven't placed any orders yet.</p>
      ) : (
        <ul className="space-y-6">
          {ordersQuery.data.map((order) => (
            <li key={order.id} className="border border-ink/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs text-ink/50">{order.id.slice(0, 8)}</p>
                <span className="font-mono text-xs px-2 py-1 border border-brass text-brass">
                  {order.status}
                </span>
              </div>
              <ul className="text-sm font-body space-y-1 mb-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-mono">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <p className="font-body text-sm">Total</p>
                <p className="font-mono text-sm">${Number(order.totalAmount).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
