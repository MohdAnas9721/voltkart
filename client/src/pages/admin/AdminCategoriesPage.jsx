import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', icon: 'zap', parentCategory: '', bannerImage: '', description: '' });

  const load = () => adminApi.categories().then(setCategories);
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    await adminApi.createCategory({ ...form, parentCategory: form.parentCategory || null });
    toast.success('Category created');
    setForm({ name: '', icon: 'zap', parentCategory: '', bannerImage: '', description: '' });
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5">
        <h1 className="mb-4 text-2xl font-black">Add Category</h1>
        <div className="grid gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Icon name" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <select className="input" value={form.parentCategory} onChange={(e) => setForm({ ...form, parentCategory: e.target.value })}>
            <option value="">Parent category</option>
            {categories.filter((item) => !item.parentCategory).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
          <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary">Create Category</button>
        </div>
      </form>
      <div>
        <h1 className="mb-4 text-2xl font-black">Category Management</h1>
        <AdminTable
          rows={categories}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'parentCategory', label: 'Parent', render: (row) => row.parentCategory?.name || 'Main' },
            { key: 'slug', label: 'Slug' }
          ]}
          renderActions={(row) => <button className="btn-secondary px-3 py-1.5 text-rose-600" onClick={() => adminApi.deleteCategory(row._id).then(load)}>Delete</button>}
        />
      </div>
    </div>
  );
}
