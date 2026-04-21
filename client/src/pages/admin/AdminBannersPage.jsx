import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '/', placement: 'home-hero', sortOrder: 0, isActive: true });
  const load = () => adminApi.banners().then(setBanners);
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    await adminApi.createBanner(form);
    toast.success('Banner created');
    setForm({ title: '', subtitle: '', image: '', link: '/', placement: 'home-hero', sortOrder: 0, isActive: true });
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5">
        <h1 className="mb-4 text-2xl font-black">Add Banner</h1>
        <div className="grid gap-3">
          {['title', 'subtitle', 'image', 'link'].map((key) => <input key={key} className="input" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== 'subtitle'} />)}
          <select className="input" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
            <option value="home-hero">home-hero</option>
            <option value="home-offer">home-offer</option>
            <option value="category">category</option>
          </select>
          <button className="btn-primary">Create Banner</button>
        </div>
      </form>
      <div>
        <h1 className="mb-4 text-2xl font-black">Banner Management</h1>
        <AdminTable
          rows={banners}
          columns={[
            { key: 'image', label: 'Image', render: (row) => <img src={row.image} alt={row.title} className="h-12 w-20 rounded object-cover" /> },
            { key: 'title', label: 'Title' },
            { key: 'placement', label: 'Placement' },
            { key: 'isActive', label: 'Active', render: (row) => row.isActive ? 'Yes' : 'No' }
          ]}
          renderActions={(row) => <button className="btn-secondary px-3 py-1.5 text-rose-600" onClick={() => adminApi.deleteBanner(row._id).then(load)}>Delete</button>}
        />
      </div>
    </div>
  );
}
