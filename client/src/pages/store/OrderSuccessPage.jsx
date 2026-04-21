import { CheckCircle, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { getDeliveryEstimate } from '../../utils/deliveryEstimate';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => setOrder(null));
  }, [id]);

  const deliveryEstimate = getDeliveryEstimate({ items: order?.items || [], order });

  return (
    <main className="container-page mt-10">
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-4 text-3xl font-black text-slate-950">Order placed successfully</h1>
        <p className="mt-2 text-slate-500">Your electrical products order has been received and is ready for processing.</p>
        <div className="mx-auto mt-5 max-w-md rounded-md border border-emerald-100 bg-emerald-50 p-4 text-left text-sm">
          <p className="flex items-center gap-2 font-bold text-emerald-800">
            <Truck className="h-4 w-4" />
            {deliveryEstimate.deliveryByText}
          </p>
          <p className="mt-1 text-emerald-700">{deliveryEstimate.daysText}</p>
          <p className="mt-1 text-slate-600">{deliveryEstimate.dispatchText}</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={`/orders/${id}`} className="btn-primary">Track Order</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
