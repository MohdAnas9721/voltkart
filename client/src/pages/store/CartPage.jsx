import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { getDeliveryEstimate, getPolicySummary } from '../../utils/deliveryEstimate';
import { getDemoProductImage, getProductImage } from '../../utils/productImages';

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();

  if (!cart.items.length) {
    return (
      <main className="container-page mt-8">
        <EmptyState
          title="Your cart is empty"
          message="Add wires, breakers, lighting or switches to start an order."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      </main>
    );
  }

  return (
    <main className="container-page mt-8">
      <h1 className="mb-6 text-3xl font-black text-slate-950">Shopping Cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {cart.items.map((item) => {
            const itemEstimate = getDeliveryEstimate({ product: item.product });
            const policySummary = getPolicySummary(item.product);
            return (
              <div key={item._id} className="card grid gap-4 p-4 sm:grid-cols-[110px_1fr_auto]">
                <Link to={`/product/${item.product.slug}`}>
                  <img
                    src={getProductImage(item.product)}
                    onError={(event) => { event.currentTarget.src = getDemoProductImage(item.product); }}
                    alt={item.product.name}
                    className="h-28 w-full rounded-md object-cover sm:w-28"
                  />
                </Link>
                <div>
                  <Link to={`/product/${item.product.slug}`} className="font-bold text-slate-950 hover:text-primary-700">{item.product.name}</Link>
                  <p className="mt-1 text-sm text-slate-500">{item.product.brand?.name} / SKU {item.product.sku}</p>
                  <p className="mt-2 font-black">{formatCurrency(item.product.price)}</p>
                  <p className="mt-1 text-sm text-emerald-700">{item.product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{itemEstimate.deliveryByText}</p>
                  <p className="mt-1 text-xs text-slate-500">{policySummary.cod} · {policySummary.return}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:block sm:space-y-3">
                  <div className="flex w-fit items-center overflow-hidden rounded-md border border-slate-300">
                    <button type="button" className="p-2 hover:bg-slate-50" onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}><Minus className="h-4 w-4" /></button>
                    <span className="min-w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" className="p-2 hover:bg-slate-50" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                  </div>
                  <button type="button" onClick={() => removeItem(item._id)} className="btn-secondary text-rose-600"><Trash2 className="h-4 w-4" /> Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        <CartSummary
          totals={cart.totals}
          deliveryEstimate={getDeliveryEstimate({ items: cart.items })}
          action={<Link to="/checkout" className="btn-primary mt-5 w-full">Proceed to Checkout</Link>}
        />
      </div>
    </main>
  );
}
