import { Phone, RotateCcw, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import OrderTracker from '../../components/checkout/OrderTracker';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import { getDeliveryEstimate } from '../../utils/deliveryEstimate';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  const load = () => api.get(`/orders/${id}`).then(({ data }) => setOrder(data));

  useEffect(() => {
    load();
  }, [id]);

  if (!order) return <main className="container-page mt-8"><div className="card h-40 animate-pulse" /></main>;

  const deliveryEstimate = getDeliveryEstimate({ items: order.items, order });
  const canRequestReturn =
    order.deliveryStatus === 'delivered' &&
    order.returnStatus === 'none' &&
    order.items.some((item) => item.returnAvailable);

  const requestReturn = async () => {
    try {
      await api.post(`/orders/${order._id}/return`, { reason: returnReason || 'Customer requested return' });
      toast.success('Return request submitted');
      setReturnReason('');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Return request failed');
    }
  };

  return (
    <main className="container-page mt-8">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Track Order</h1>
          <p className="mt-1 text-slate-500">Tracking ID: <span className="font-bold text-slate-950">{order.trackingId}</span></p>
        </div>
        <Link to="/orders" className="btn-secondary">All Orders</Link>
      </div>

      <OrderTracker status={order.deliveryStatus || order.orderStatus} />

      <section className="card mt-6 p-5">
        <h2 className="mb-3 text-lg font-bold text-slate-950">Where Your Order Has Reached</h2>
        <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3 text-sm">
          <p className="flex items-center gap-2 font-bold text-emerald-800">
            <Truck className="h-4 w-4" />
            {deliveryEstimate.deliveryByText}
          </p>
          <p className="mt-1 text-emerald-700">{deliveryEstimate.daysText}</p>
          <p className="mt-1 text-slate-600">{deliveryEstimate.dispatchText}</p>
          <p className="mt-2 font-semibold text-slate-700">Current location: {order.currentLocationText || 'Order processing'}</p>
          {order.deliveryNote && <p className="mt-1 text-slate-600">Note: {order.deliveryNote}</p>}
        </div>
        {order.assignedDeliveryBoy && (
          <div className="mt-4 rounded-md border border-slate-200 bg-white p-3 text-sm">
            <p className="font-bold text-slate-950">Delivery partner: {order.assignedDeliveryBoy.name}</p>
            {order.assignedDeliveryBoy.phone && <p className="mt-1 flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> {order.assignedDeliveryBoy.phone}</p>}
          </div>
        )}
        <div className="mt-4 grid gap-3">
          {(order.trackingEvents || []).slice().reverse().map((event) => (
            <div key={event._id || `${event.status}-${event.timestamp}`} className="rounded-md border border-slate-200 p-3 text-sm">
              <p className="font-bold text-slate-950">{event.message}</p>
              <p className="text-slate-500">{event.locationText || order.currentLocationText} - {new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold">Items & Policies</h2>
          <div className="grid gap-3">
            {order.items.map((item) => (
              <div key={item.sku} className="flex gap-3 border-b border-slate-100 pb-3 last:border-b-0">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-slate-500">Qty {item.quantity} - {formatCurrency(item.price)}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.warrantyAvailable ? item.warrantyText : 'No warranty'} | {item.returnAvailable ? `${item.returnWindowDays}-day return` : 'No return'} | {item.openBoxDeliveryAvailable ? 'Open box available' : 'No open box'}</p>
                </div>
              </div>
            ))}
          </div>
          {canRequestReturn && (
            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="flex items-center gap-2 font-bold text-slate-950"><RotateCcw className="h-4 w-4" /> Request Return</p>
              <input className="input mt-3" placeholder="Reason for return" value={returnReason} onChange={(e) => setReturnReason(e.target.value)} />
              <button type="button" onClick={requestReturn} className="btn-secondary mt-3">Submit Return Request</button>
            </div>
          )}
          {order.returnStatus !== 'none' && <p className="mt-4 rounded bg-amber-50 p-3 text-sm font-semibold text-amber-800">Return status: {order.returnStatus}</p>}
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
          <div className="grid gap-2 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><b>{formatCurrency(order.subtotal)}</b></p>
            <p className="flex justify-between"><span>Delivery</span><b>{formatCurrency(order.shippingCharge)}</b></p>
            {order.codCharge > 0 && <p className="flex justify-between"><span>COD fee</span><b>{formatCurrency(order.codCharge)}</b></p>}
            <p className="flex justify-between"><span>Tax</span><b>{formatCurrency(order.taxAmount)}</b></p>
            <p className="flex justify-between text-lg"><span>Total</span><b>{formatCurrency(order.totalAmount)}</b></p>
          </div>
        </section>
      </div>
    </main>
  );
}
