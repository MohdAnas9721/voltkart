import { LogOut, MapPin, PackageCheck, Truck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const statusOptions = ['picked', 'out-for-delivery', 'nearby-hub', 'delivered', 'delivery-failed'];

export default function DeliveryDashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ assignedOrders: [], completedDeliveriesToday: 0, reward: null });
  const [drafts, setDrafts] = useState({});

  const load = () => api.get('/delivery/dashboard').then(({ data: response }) => setData(response));

  useEffect(() => {
    load();
  }, []);

  const updateOrder = async (orderId) => {
    const draft = drafts[orderId] || {};
    if (!draft.status) return toast.error('Choose a delivery status');
    const { data: response } = await api.put(`/delivery/orders/${orderId}/status`, {
      status: draft.status,
      currentLocationText: draft.currentLocationText,
      message: draft.message,
      deliveryNote: draft.deliveryNote
    });
    if (response.reward?.rewardIssued) toast.success(response.reward.message || 'Reward earned');
    else toast.success('Delivery status updated');
    setDrafts((state) => ({ ...state, [orderId]: {} }));
    load();
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2 text-xl font-black text-slate-950">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-600 text-white"><Zap className="h-6 w-6" /></span>
            Delivery Dashboard
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">{user?.name}</span>
            <button type="button" onClick={logout} className="btn-secondary"><LogOut className="h-4 w-4" /> Logout</button>
          </div>
        </div>
      </header>

      <section className="container-page py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <Truck className="mb-3 h-6 w-6 text-primary-700" />
            <p className="text-sm font-semibold text-slate-500">Assigned Deliveries</p>
            <p className="mt-2 text-2xl font-black">{data.assignedOrders.length}</p>
          </div>
          <div className="card p-5">
            <PackageCheck className="mb-3 h-6 w-6 text-emerald-700" />
            <p className="text-sm font-semibold text-slate-500">Completed Today</p>
            <p className="mt-2 text-2xl font-black">{data.completedDeliveriesToday}</p>
          </div>
          <div className="card p-5">
            <Zap className="mb-3 h-6 w-6 text-copper" />
            <p className="text-sm font-semibold text-slate-500">Reward</p>
            <p className="mt-2 text-sm font-bold text-slate-950">
              {data.reward?.rewardIssued ? data.reward.rewardCouponCode || data.reward.message : `${data.reward?.completedDeliveries || 0}/${data.reward?.threshold || 20} deliveries`}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {data.assignedOrders.map((order) => (
            <article key={order._id} className="card p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <p className="font-black text-slate-950">Order #{order.trackingId}</p>
                  <p className="text-sm text-slate-500">{order.user?.name} - {order.shippingAddress?.line1}, {order.shippingAddress?.city}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600"><MapPin className="h-4 w-4" /> {order.currentLocationText || 'Assigned for delivery'}</p>
                </div>
                <span className="rounded bg-primary-50 px-2 py-1 text-xs font-bold uppercase text-primary-700">{order.deliveryStatus}</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_1fr_auto]">
                <select className="input" value={drafts[order._id]?.status || ''} onChange={(e) => setDrafts((state) => ({ ...state, [order._id]: { ...state[order._id], status: e.target.value } }))}>
                  <option value="">Update status</option>
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <input className="input" placeholder="Current location" value={drafts[order._id]?.currentLocationText || ''} onChange={(e) => setDrafts((state) => ({ ...state, [order._id]: { ...state[order._id], currentLocationText: e.target.value } }))} />
                <input className="input" placeholder="Delivery note" value={drafts[order._id]?.deliveryNote || ''} onChange={(e) => setDrafts((state) => ({ ...state, [order._id]: { ...state[order._id], deliveryNote: e.target.value, message: e.target.value } }))} />
                <button type="button" className="btn-primary" onClick={() => updateOrder(order._id)}>Save</button>
              </div>
            </article>
          ))}
          {!data.assignedOrders.length && <div className="card p-8 text-center text-slate-500">No assigned deliveries right now.</div>}
        </div>
      </section>
    </main>
  );
}
