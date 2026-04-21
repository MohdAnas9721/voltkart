import EmptyState from '../common/EmptyState';
import LoadingSkeleton from '../common/LoadingSkeleton';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], loading }) {
  if (loading) return <LoadingSkeleton rows={8} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" />;
  if (!products.length) return <EmptyState title="No electrical products found" message="Try a different category, brand, price range or search term." />;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => <ProductCard key={product._id} product={product} />)}
    </div>
  );
}
