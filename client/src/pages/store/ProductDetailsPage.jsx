import { BadgeCheck, Banknote, Heart, RotateCcw, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ProductCard from '../../components/product/ProductCard';
import Rating from '../../components/product/Rating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProduct, getProducts, getReviews } from '../../services/catalogService';
import { formatCurrency } from '../../utils/currency';
import { getDeliveryEstimate, getPolicySummary } from '../../utils/deliveryEstimate';
import { getDemoProductImage, getProductGallery, getProductImage } from '../../utils/productImages';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(slug)
      .then((data) => {
        const productGallery = getProductGallery(data);
        setProduct(data);
        setGallery(productGallery);
        setActiveImage(productGallery[0]);
        getProducts({ category: data.category?.slug, limit: 4 }).then((res) => setRelated(res.products.filter((item) => item._id !== data._id)));
        getReviews(data._id).then(setReviews).catch(() => setReviews([]));
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main className="container-page mt-6"><LoadingSkeleton rows={4} /></main>;
  if (!product) return null;

  const clampedQty = Math.max(1, Math.min(qty || 1, product.stock || 1));
  const deliveryEstimate = getDeliveryEstimate({ product });
  const policySummary = getPolicySummary(product);
  const buyNow = async () => {
    const ok = await addToCart(product._id, clampedQty);
    if (ok) navigate('/checkout');
  };

  return (
    <main className="container-page mt-6">
      <Breadcrumb items={[{ label: product.category?.name, to: `/category/${product.category?.slug}` }, { label: product.name }]} />
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 md:grid-cols-[96px_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:block md:space-y-3 md:overflow-visible">
            {gallery.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveImage(src)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white ${activeImage === src ? 'border-primary-600 ring-2 ring-primary-100' : 'border-slate-200'}`}
              >
                <img src={src} onError={(event) => { event.currentTarget.src = getDemoProductImage(product); }} alt={product.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 overflow-hidden rounded-lg border border-slate-200 bg-white md:order-2">
            <img src={activeImage || getProductImage(product)} alt={product.name} onError={(event) => { event.currentTarget.src = getDemoProductImage(product); }} className="aspect-square w-full object-cover" />
          </div>
        </div>
        <div className="card p-5 md:p-6">
          <p className="text-sm font-bold uppercase text-primary-700">{product.brand?.name} / {product.category?.name}</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">{product.name}</h1>
          <div className="mt-3"><Rating value={product.rating} count={product.numReviews} /></div>
          <p className="mt-4 text-slate-600">{product.shortDescription}</p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black">{formatCurrency(product.price)}</span>
            <span className="text-lg text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
            <span className="rounded-md bg-copper px-2.5 py-1 text-sm font-black text-white">{product.discountPercent}% off</span>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p><span className="font-bold text-slate-950">SKU:</span> {product.sku}</p>
            <p>
              <span className="font-bold text-slate-950">Stock:</span>{' '}
              {product.stock > 0 ? <span className="font-semibold text-emerald-700">{product.stock} units available</span> : <span className="font-semibold text-rose-600">Out of stock</span>}
            </p>
          </div>
          <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-800">
              <Truck className="h-4 w-4" />
              {deliveryEstimate.deliveryByText}
            </p>
            <p className="mt-1 text-sm text-emerald-700">{deliveryEstimate.daysText}</p>
            <p className="mt-1 text-sm text-slate-600">{deliveryEstimate.dispatchText}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              [ShieldCheck, 'Warranty', policySummary.warranty, product.warrantyAvailable],
              [RotateCcw, 'Return', policySummary.return, product.returnAvailable],
              [BadgeCheck, 'Open Box Delivery', policySummary.openBox, product.openBoxDeliveryAvailable],
              [Banknote, 'COD', policySummary.cod, product.codAvailable !== false],
              [Truck, 'Delivery Charge', policySummary.deliveryCharge, true]
            ].map(([Icon, label, text, enabled]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="flex items-center gap-2 font-bold text-slate-950">
                  <Icon className={`h-4 w-4 ${enabled ? 'text-primary-600' : 'text-slate-400'}`} />
                  {label}
                </p>
                <p className="mt-1 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input className="input w-24" type="number" min="1" max={product.stock} value={qty} onChange={(event) => setQty(Number(event.target.value))} />
            <button type="button" disabled={product.stock <= 0} onClick={() => addToCart(product._id, clampedQty)} className="btn-primary"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
            <button type="button" disabled={product.stock <= 0} onClick={buyNow} className="btn-secondary">Buy Now</button>
            <button type="button" onClick={() => toggleWishlist(product)} className="btn-secondary"><Heart className={`h-4 w-4 ${isWished(product._id) ? 'fill-current text-rose-600' : ''}`} /> Wishlist</button>
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="card p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">Description</h2>
          <p className="text-slate-600">{product.fullDescription}</p>
          <h2 className="mb-3 mt-6 text-xl font-bold text-slate-950">Specifications</h2>
          <div className="overflow-hidden rounded-md border border-slate-200">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 border-b border-slate-100 last:border-b-0">
                <div className="bg-slate-50 px-4 py-3 text-sm font-bold">{key}</div>
                <div className="px-4 py-3 text-sm text-slate-600">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-950">Customer Reviews</h2>
          {reviews.length === 0 ? <p className="text-sm text-slate-500">No written reviews yet.</p> : reviews.map((review) => (
            <div key={review._id} className="border-b border-slate-100 py-3 last:border-b-0">
              <Rating value={review.rating} />
              <p className="mt-2 font-bold">{review.title}</p>
              <p className="text-sm text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Related Products</h2>
          <Link to={`/category/${product.category?.slug}`} className="text-sm font-bold text-primary-700">View category</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <ProductCard key={item._id} product={item} />)}
        </div>
      </section>
    </main>
  );
}
