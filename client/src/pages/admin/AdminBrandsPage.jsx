import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '' });
  const load = () => adminApi.brands().then(setBrands);
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    await adminApi.createBrand(form);
    toast.success('Brand created');
    setForm({ name: '', logo: '' });
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5">
        <h1 className="mb-4 text-2xl font-black">Add Brand</h1>
        <div className="grid gap-3">
          <input className="input" placeholder="Brand name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Logo URL" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
          <button className="btn-primary">Create Brand</button>
        </div>
      </form>
      <div>
        <h1 className="mb-4 text-2xl font-black">Brand Management</h1>
        <AdminTable
          rows={brands}
          columns={[
            { key: 'logo', label: 'Logo', render: (row) => <img src={row.logo} alt={row.name} className="h-10 w-10 rounded object-cover" /> },
            { key: 'name', label: 'Name' },
            { key: 'slug', label: 'Slug' }
          ]}
          renderActions={(row) => <button className="btn-secondary px-3 py-1.5 text-rose-600" onClick={() => adminApi.deleteBrand(row._id).then(load)}>Delete</button>}
        />
      </div>
    </div>
  );
}
