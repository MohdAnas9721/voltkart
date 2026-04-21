import { Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../../components/cart/CartSummary';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { getDeliveryEstimate } from '../../utils/deliveryEstimate';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const defaultAddress = user?.addresses?.find((address) => address.isDefault) || user?.addresses?.[0] || {};
  const [address, setAddress] = useState({
    fullName: defaultAddress.fullName || user?.name || '',
    phone: defaultAddress.phone || user?.phone || '',
    line1: defaultAddress.line1 || '',
    line2: defaultAddress.line2 || '',
    city: defaultAddress.city || '',
    state: defaultAddress.state || '',
    postalCode: defaultAddress.postalCode || '',
    country: defaultAddress.country || 'India',
    approxDistanceKm: defaultAddress.approxDistanceKm || 8
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [settings, setSettings] = useState(null);
  const [estimatedTotals, setEstimatedTotals] = useState(null);
  const deliveryEstimate = getDeliveryEstimate({ items: cart.items });
  const codAllowed = cart.totals.codAllowed !== false;
  const summaryTotals = useMemo(() => {
    if (estimatedTotals) return estimatedTotals;
    const codCharge = paymentMethod === 'cod' && codAllowed ? Number(settings?.codCharge || cart.totals.codCharge || 0) : 0;
    return { ...cart.totals, codCharge, totalAmount: (cart.totals.totalAmount || 0) + codCharge };
  }, [cart.totals, codAllowed, estimatedTotals, paymentMethod, settings]);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data)).catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (!codAllowed && paymentMethod === 'cod') setPaymentMethod('online');
  }, [codAllowed, paymentMethod]);

  useEffect(() => {
    if (!cart.items.length) return;
    const timer = window.setTimeout(() => {
      api.get('/cart', {
        params: {
          approxDistanceKm: address.approxDistanceKm,
          paymentMethod
        }
      }).then(({ data }) => setEstimatedTotals(data.totals)).catch(() => setEstimatedTotals(null));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [address.approxDistanceKm, cart.items.length, paymentMethod]);

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!cart.items.length) return toast.error('Cart is empty');
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: address, paymentMethod });
      await fetchCart();
      toast.success(paymentMethod === 'online' ? 'Mock online payment successful' : 'Order placed');
      navigate(`/order-success/${data._id}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="container-page mt-8">
      <h1 className="mb-6 text-3xl font-black text-slate-950">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="card p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Delivery Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['fullName', 'Full name'],
                ['phone', 'Phone'],
                ['line1', 'Address line 1'],
                ['line2', 'Address line 2'],
                ['city', 'City'],
                ['state', 'State'],
                ['postalCode', 'Postal code'],
                ['country', 'Country'],
                ['approxDistanceKm', 'Approx distance km']
              ].map(([key, label]) => (
                <label key={key} className="text-sm font-semibold">
                  {label}
                  <input required={key !== 'line2'} className="input mt-1" value={address[key]} onChange={(event) => setAddress((state) => ({ ...state, [key]: event.target.value }))} />
                </label>
              ))}
            </div>
          </section>
          <section className="card p-5">
            <h2 className="mb-3 text-lg font-bold text-slate-950">Delivery Estimate</h2>
            <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3 text-sm">
              <p className="flex items-center gap-2 font-bold text-emerald-800">
                <Truck className="h-4 w-4" />
                {deliveryEstimate.deliveryByText}
              </p>
              <p className="mt-1 text-emerald-700">{deliveryEstimate.daysText}</p>
              <p className="mt-1 text-slate-600">{deliveryEstimate.dispatchText}</p>
            </div>
          </section>
          <section className="card p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Payment Method</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ...(codAllowed ? [['cod', 'Cash on Delivery', 'Pay when the order reaches your address.']] : []),
                ['online', 'Online Payment', 'Mock success flow, ready for gateway integration.']
              ].map(([value, label, text]) => (
                <label key={value} className={`rounded-lg border p-4 ${paymentMethod === value ? 'border-primary-600 bg-primary-50' : 'border-slate-200 bg-white'}`}>
                  <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} />
                  <span className="ml-2 font-bold">{label}</span>
                  <p className="mt-2 text-sm text-slate-500">{text}</p>
                </label>
              ))}
            </div>
            {!codAllowed && <p className="mt-3 text-sm font-semibold text-amber-700">COD is not available because one or more products require prepaid payment.</p>}
          </section>
        </div>
        <CartSummary
          totals={summaryTotals}
          deliveryEstimate={deliveryEstimate}
          action={<button type="submit" disabled={placing} className="btn-primary mt-5 w-full">{placing ? 'Placing...' : 'Place Order'}</button>}
        />
      </form>
    </main>
  );
}
