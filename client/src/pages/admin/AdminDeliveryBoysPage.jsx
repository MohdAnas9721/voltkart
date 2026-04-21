import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';

const empty = {
  name: '',
  email: '',
  phone: '',
  password: 'Delivery123',
  isActive: true
};

export default function AdminDeliveryBoysPage() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => Promise.all([adminApi.deliveryBoys(), adminApi.deliveryRewards()]).then(([boys, rewardRows]) => {
    setDeliveryBoys(boys);
    setRewards(rewardRows);
  });

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (editing) await adminApi.updateDeliveryBoy(editing, form);
    else await adminApi.createDeliveryBoy(form);
    toast.success(editing ? 'Delivery boy updated' : 'Delivery boy created');
    setEditing(null);
    setForm(empty);
    load();
  };

  const edit = (row) => {
    setEditing(row._id);
    setForm({ name: row.name, email: row.email, phone: row.phone || '', password: '', isActive: row.isActive !== false });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5">
        <h1 className="mb-4 text-2xl font-black">{editing ? 'Edit Delivery Boy' : 'Create Delivery Boy'}</h1>
        <div className="grid gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active delivery account
          </label>
          <button className="btn-primary" type="submit">{editing ? 'Save Delivery Boy' : 'Create Delivery Boy'}</button>
          {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>
      <div className="grid gap-6">
        <section>
          <h1 className="mb-4 text-2xl font-black">Delivery Boys</h1>
          <AdminTable
            rows={deliveryBoys}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'assignedOrders', label: 'Assigned' },
              { key: 'completedOrders', label: 'Completed' },
              { key: 'completedDeliveriesToday', label: 'Today' },
              { key: 'rewardIssuedToday', label: 'Reward', render: (row) => row.rewardIssuedToday ? row.rewardCouponCode || 'Issued' : 'Pending' }
            ]}
            renderActions={(row) => <button className="btn-secondary px-3 py-1.5" onClick={() => edit(row)}>Edit</button>}
          />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-black">Recent Rewards</h2>
          <AdminTable
            rows={rewards}
            columns={[
              { key: 'deliveryBoy', label: 'Delivery Boy', render: (row) => row.deliveryBoy?.name },
              { key: 'dateKey', label: 'Date' },
              { key: 'completedDeliveries', label: 'Completed' },
              { key: 'rewardIssued', label: 'Issued', render: (row) => row.rewardIssued ? 'Yes' : 'No' },
              { key: 'rewardCouponCode', label: 'Coupon' }
            ]}
          />
        </section>
      </div>
    </div>
  );
}
