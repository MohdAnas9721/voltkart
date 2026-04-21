import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/currency';
import { getDemoProductImage, getProductImage } from '../../utils/productImages';
import Rating from './Rating';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const wished = isWished(product._id);

  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-soft">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={getProductImage(product)}
          alt={product.name}
          onError={(event) => { event.currentTarget.src = getDemoProductImage(product); }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.discountPercent > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-copper px-2.5 py-1 text-xs font-black text-white shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">{product.brand?.name}</p>
            <Link to={`/product/${product.slug}`} className="mt-1 line-clamp-2 font-bold leading-snug text-slate-950 hover:text-primary-700">
              {product.name}
            </Link>
          </div>
          <button type="button" onClick={() => toggleWishlist(product)} className={`shrink-0 rounded-md border border-slate-200 bg-white p-2 hover:border-rose-200 hover:bg-rose-50 ${wished ? 'text-rose-600' : 'text-slate-500'}`} aria-label="Toggle wishlist">
            <Heart className={`h-5 w-5 ${wished ? 'fill-current' : ''}`} />
          </button>
        </div>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span className="text-lg font-black text-slate-950">{formatCurrency(product.price)}</span>
          <span className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
        </div>
        <div className="mt-2 text-sm">
          {product.stock > 0 ? (
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{product.stock > 20 ? 'In stock' : `Only ${product.stock} left`}</span>
          ) : (
            <span className="inline-flex rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">Out of stock</span>
          )}
        </div>
        <button type="button" disabled={product.stock <= 0} onClick={() => addToCart(product._id, 1)} className="btn-primary mt-4 w-full">
          <ShoppingCart className="h-4 w-4" />
          Quick Add
        </button>
      </div>
    </article>
  );
}
