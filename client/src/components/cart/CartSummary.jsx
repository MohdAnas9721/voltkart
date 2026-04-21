import { Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export default function CartSummary({ totals = {}, action, deliveryEstimate }) {
  const lines = [
    ['Subtotal', totals.subtotal || 0],
    ['Shipping', totals.shippingCharge || 0],
    ['Discount', -(totals.discountAmount || 0)],
    ...(totals.freeDeliveryDiscount ? [['Free delivery saving', -(totals.freeDeliveryDiscount || 0)]] : []),
    ...(totals.codCharge ? [['COD fee', totals.codCharge || 0]] : []),
    ['Tax', totals.taxAmount || 0]
  ];

  return (
    <div className="card h-fit p-5">
      <h2 className="mb-4 text-lg font-bold text-slate-950">Order Summary</h2>
      <div className="grid gap-3 text-sm">
        {lines.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold">{formatCurrency(value)}</span>
          </div>
        ))}
      </div>
      <div className="my-4 border-t border-slate-200" />
      <div className="flex justify-between text-lg font-black">
        <span>Total</span>
        <span>{formatCurrency(totals.totalAmount || 0)}</span>
      </div>
      {totals.minimumOrderAmount > 0 && totals.subtotal < totals.minimumOrderAmount && (
        <p className="mt-3 rounded-md bg-amber-50 p-2 text-sm font-semibold text-amber-800">
          Minimum order amount is {formatCurrency(totals.minimumOrderAmount)}.
        </p>
      )}
      {deliveryEstimate && (
        <div className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 p-3 text-sm">
          <p className="flex items-center gap-2 font-bold text-emerald-800">
            <Truck className="h-4 w-4" />
            {deliveryEstimate.deliveryByText}
          </p>
          <p className="mt-1 text-emerald-700">{deliveryEstimate.daysText}</p>
        </div>
      )}
      {action}
    </div>
  );
}
