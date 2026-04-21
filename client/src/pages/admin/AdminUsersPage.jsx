import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import { adminApi } from '../../services/adminService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const load = () => adminApi.users({ search }).then(setUsers);
  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    await adminApi.updateUser(id, { role });
    toast.success('User role updated');
    load();
  };

  return (
    <div>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h1 className="text-2xl font-black">User Management</h1>
        <div className="flex gap-2"><input className="input w-72" placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} /><button className="btn-secondary" onClick={load}>Search</button></div>
      </div>
      <AdminTable
        rows={users}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'role', label: 'Role' }
        ]}
        renderActions={(row) => (
          <select className="input w-36" value={row.role} onChange={(e) => updateRole(row._id, e.target.value)}>
            <option value="customer">customer</option>
            <option value="admin">admin</option>
            <option value="delivery">delivery</option>
          </select>
        )}
      />
    </div>
  );
}
