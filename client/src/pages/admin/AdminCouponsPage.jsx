import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', value: '', maxDiscount: '', minOrderAmount: '' });
  const load = () => adminApi.coupons().then(setCoupons);
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault();
    await adminApi.createCoupon({ ...form, value: Number(form.value), maxDiscount: Number(form.maxDiscount || 0), minOrderAmount: Number(form.minOrderAmount || 0) });
    toast.success('Coupon created');
    setForm({ code: '', discountType: 'percentage', value: '', maxDiscount: '', minOrderAmount: '' });
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5">
        <h1 className="mb-4 text-2xl font-black">Add Coupon</h1>
        <div className="grid gap-3">
          <input className="input" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <select className="input" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}><option value="percentage">percentage</option><option value="fixed">fixed</option></select>
          <input className="input" type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          <input className="input" type="number" placeholder="Max discount" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
          <input className="input" type="number" placeholder="Minimum order amount" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
          <button className="btn-primary">Create Coupon</button>
        </div>
      </form>
      <div>
        <h1 className="mb-4 text-2xl font-black">Coupon Management</h1>
        <AdminTable rows={coupons} columns={[{ key: 'code', label: 'Code' }, { key: 'discountType', label: 'Type' }, { key: 'value', label: 'Value' }, { key: 'minOrderAmount', label: 'Min Order' }]} />
      </div>
    </div>
  );
}
