import { Check } from 'lucide-react';

const steps = ['placed', 'packed', 'assigned', 'out-for-delivery', 'nearby-hub', 'delivered'];
const labels = {
  placed: 'Placed',
  packed: 'Packed',
  assigned: 'Assigned',
  picked: 'Picked',
  shipped: 'Shipped',
  'out-for-delivery': 'Out for Delivery',
  'nearby-hub': 'Nearby Hub',
  'delivery-failed': 'Delivery Failed',
  'return-requested': 'Return Requested',
  'return-picked': 'Return Picked',
  refunded: 'Refunded',
  delivered: 'Delivered'
};

export default function OrderTracker({ status = 'placed' }) {
  const normalizedStatus = status === 'shipped' || status === 'picked' ? 'assigned' : status;
  const active = steps.indexOf(normalizedStatus);
  return (
    <div className="card p-5">
      <h2 className="mb-5 text-lg font-bold text-slate-950">Order Tracking</h2>
      <div className="grid gap-4 md:grid-cols-6">
        {steps.map((step, index) => {
          const done = index <= active;
          return (
            <div key={step} className="flex items-center gap-3 md:block">
              <div className={`grid h-9 w-9 place-items-center rounded-full border-2 ${done ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-white text-slate-400'}`}>
                <Check className="h-4 w-4" />
              </div>
              <p className={`mt-2 text-sm font-bold ${done ? 'text-primary-700' : 'text-slate-500'}`}>{labels[step]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
