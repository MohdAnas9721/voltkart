import { BarChart3, Boxes, Building2, Image, LogOut, Package, Settings, ShoppingBag, Tags, Truck, Users, Zap } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  ['Dashboard', '/admin', BarChart3],
  ['Products', '/admin/products', Package],
  ['Categories', '/admin/categories', Boxes],
  ['Brands', '/admin/brands', Building2],
  ['Orders', '/admin/orders', ShoppingBag],
  ['Delivery Boys', '/admin/delivery-boys', Truck],
  ['Users', '/admin/users', Users],
  ['Banners', '/admin/banners', Image],
  ['Settings', '/admin/settings', Settings],
  ['Coupons', '/admin/coupons', Tags]
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <div className="mb-8 flex items-center gap-2 text-xl font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-600 text-white"><Zap className="h-6 w-6" /></span>
          Admin
        </div>
        <nav className="grid gap-1">
          {links.map(([label, to, Icon]) => (
            <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => `admin-link flex items-center gap-2 ${isActive ? 'admin-link-active' : ''}`}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={logout} className="admin-link absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="lg:pl-64">
        <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {links.slice(0, 8).map(([label, to]) => (
              <NavLink key={to} end={to === '/admin'} to={to} className="admin-link">{label}</NavLink>
            ))}
          </div>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
