import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import ProductCard from '../../components/product/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  return (
    <main className="container-page mt-8">
      <h1 className="mb-6 text-3xl font-black text-slate-950">Wishlist</h1>
      {wishlist.items.length === 0 ? (
        <EmptyState title="No saved products" message="Save products you want to compare or buy later." action={<Link to="/products" className="btn-primary">Browse Products</Link>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.items.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </main>
  );
}
