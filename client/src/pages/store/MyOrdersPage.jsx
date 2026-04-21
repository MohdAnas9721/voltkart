import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import { getDeliveryEstimate } from '../../utils/deliveryEstimate';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data));
  }, []);

  return (
    <main className="container-page mt-8">
      <h1 className="mb-6 text-3xl font-black text-slate-950">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Your placed electrical product orders will show here." action={<Link to="/products" className="btn-primary">Shop Products</Link>} />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => <OrderRow key={order._id} order={order} />)}
        </div>
      )}
    </main>
  );
}

function OrderRow({ order }) {
  const deliveryEstimate = getDeliveryEstimate({ items: order.items, order });
  return (
    <Link to={`/orders/${order._id}`} className="card grid gap-3 p-4 hover:border-primary-400 md:grid-cols-[1fr_auto]">
      <div>
        <p className="font-black text-slate-950">Order #{order.trackingId}</p>
        <p className="text-sm text-slate-500">{order.items.length} items - {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="mt-1 text-sm font-semibold text-slate-600">{deliveryEstimate.deliveryByText}</p>
        <p className="mt-2 inline-flex rounded bg-primary-50 px-2 py-1 text-xs font-bold uppercase text-primary-700">{order.deliveryStatus || order.orderStatus}</p>
      </div>
      <div className="font-black">{formatCurrency(order.totalAmount)}</div>
    </Link>
  );
}
