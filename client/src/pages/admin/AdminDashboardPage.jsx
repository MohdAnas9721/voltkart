import { AlertTriangle, IndianRupee, Package, ShoppingBag, Truck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminService';
import { formatCurrency } from '../../utils/currency';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({});

  useEffect(() => { adminApi.stats().then(setStats); }, []);

  const cards = [
    ['Total Products', stats.totalProducts || 0, Package, 'text-primary-700'],
    ['Total Orders', stats.totalOrders || 0, ShoppingBag, 'text-emerald-700'],
    ['Total Sales', formatCurrency(stats.totalSales || 0), IndianRupee, 'text-copper'],
    ['Total Users', stats.totalUsers || 0, Users, 'text-indigo-700'],
    ['Delivery Boys', stats.deliveryBoys || 0, Truck, 'text-sky-700'],
    ['Active Deliveries', stats.pendingDeliveries || 0, Truck, 'text-emerald-700'],
    ['Low Stock Products', stats.lowStockProducts || 0, AlertTriangle, 'text-rose-700']
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-black text-slate-950">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {cards.map(([label, value, Icon, color]) => (
          <div key={label} className="card p-5">
            <Icon className={`mb-4 h-7 w-7 ${color}`} />
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
