import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';
import { formatCurrency } from '../../utils/currency';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [search, setSearch] = useState('');
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const load = () => Promise.all([adminApi.orders({ search }), adminApi.deliveryBoys()]).then(([orderData, deliveryData]) => {
    setOrders(orderData);
    setDeliveryBoys(deliveryData.filter((boy) => boy.isActive !== false));
  });
  useEffect(() => { load(); }, []);

  const update = async (id, orderStatus) => {
    await adminApi.updateOrderStatus(id, { orderStatus });
    toast.success('Order status updated');
    load();
  };

  const assign = async (id, deliveryBoyId) => {
    if (!deliveryBoyId) return;
    await adminApi.assignDeliveryBoy(id, { deliveryBoyId, currentLocationText: 'Assigned from warehouse' });
    toast.success('Delivery boy assigned');
    load();
  };

  const updateTracking = async (id) => {
    const draft = trackingDrafts[id] || {};
    if (!draft.status && !draft.currentLocationText && !draft.message) return;
    await adminApi.updateTracking(id, draft);
    toast.success('Tracking updated');
    setTrackingDrafts((state) => ({ ...state, [id]: {} }));
    load();
  };

  return (
    <div>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h1 className="text-2xl font-black">Order Management</h1>
        <div className="flex gap-2"><input className="input w-72" placeholder="Search tracking ID" value={search} onChange={(e) => setSearch(e.target.value)} /><button className="btn-secondary" onClick={load}>Search</button></div>
      </div>
      <AdminTable
        rows={orders}
        columns={[
          { key: 'trackingId', label: 'Tracking' },
          { key: 'user', label: 'Customer', render: (row) => row.user?.name },
          { key: 'totalAmount', label: 'Total', render: (row) => formatCurrency(row.totalAmount) },
          { key: 'paymentStatus', label: 'Payment' },
          { key: 'deliveryStatus', label: 'Delivery' },
          { key: 'assignedDeliveryBoy', label: 'Delivery Boy', render: (row) => row.assignedDeliveryBoy?.name || 'Unassigned' }
        ]}
        renderActions={(row) => (
          <div className="grid min-w-72 gap-2 text-left">
            <select className="input" value={row.orderStatus} onChange={(e) => update(row._id, e.target.value)}>
              {['placed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select className="input" value={row.assignedDeliveryBoy?._id || ''} onChange={(e) => assign(row._id, e.target.value)}>
              <option value="">Assign delivery boy</option>
              {deliveryBoys.map((boy) => <option key={boy._id} value={boy._id}>{boy.name}</option>)}
            </select>
            <div className="grid gap-2 md:grid-cols-3">
              <select className="input" value={trackingDrafts[row._id]?.status || ''} onChange={(e) => setTrackingDrafts((state) => ({ ...state, [row._id]: { ...state[row._id], status: e.target.value } }))}>
                <option value="">Tracking status</option>
                {['packed', 'assigned', 'picked', 'out-for-delivery', 'nearby-hub', 'delivered', 'delivery-failed', 'return-picked', 'refunded'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <input className="input" placeholder="Location" value={trackingDrafts[row._id]?.currentLocationText || ''} onChange={(e) => setTrackingDrafts((state) => ({ ...state, [row._id]: { ...state[row._id], currentLocationText: e.target.value } }))} />
              <button type="button" className="btn-secondary px-3" onClick={() => updateTracking(row._id)}>Push</button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
