import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import { getBrands, getProducts } from '../../services/catalogService';

const STORE_PRODUCT_LIMIT = 20;

export default function ProductListingPage({ searchMode = false, title }) {
  const { categories } = useOutletContext();
  const { slug } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);
  const [data, setData] = useState({ products: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => ({
    category: slug || searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    discount: searchParams.get('discount') || '',
    rating: searchParams.get('rating') || '',
    stock: searchParams.get('stock') || '',
    conductorSize: searchParams.get('conductorSize') || '',
    packing: searchParams.get('packing') || '',
    sort: searchParams.get('sort') || 'newest',
    limit: Number(searchParams.get('limit') || STORE_PRODUCT_LIMIT),
    page: Number(searchParams.get('page') || 1)
  }));

  useEffect(() => { getBrands().then(setBrands); }, []);
  useEffect(() => {
    const categoryFromQuery = searchParams.get('category') || '';
    const shouldClearCategory = location.pathname === '/products' || location.pathname === '/category' || location.pathname === '/search';
    setFilters((state) => ({
      ...state,
      category: slug || categoryFromQuery || (shouldClearCategory ? '' : state.category),
      page: 1
    }));
  }, [slug, location.pathname]);

  const query = searchParams.get('q') || '';
  const heading = useMemo(() => {
    if (title) return title;
    if (searchMode) return `Search results for "${query}"`;
    const category = categories.find((item) => item.slug === filters.category);
    return category?.name || 'All Electrical Products';
  }, [categories, filters.category, query, searchMode, title]);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries({ ...filters, limit: filters.limit || STORE_PRODUCT_LIMIT, search: searchMode ? query : '' }).filter(([, value]) => value !== '' && value !== null && value !== undefined));
    setLoading(true);
    setSearchParams((current) => {
      const next = new URLSearchParams(searchMode ? { q: query } : {});
      Object.entries(params).forEach(([key, value]) => { if (!(searchMode && key === 'search')) next.set(key, value); });
      return next;
    }, { replace: true });
    getProducts(params).then(setData).finally(() => setLoading(false));
  }, [filters, query, searchMode]);

  return (
    <main className="container-page mt-6">
      <Breadcrumb items={[{ label: heading }]} />
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-950">{heading}</h1>
          <p className="mt-1 text-sm text-slate-500">{data.pagination?.total || 0} products found with live stock, brand and price filters.</p>
        </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setShowFilters((value) => !value)} className="btn-secondary lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <select className="input w-full sm:w-56" value={filters.sort} onChange={(event) => setFilters((state) => ({ ...state, sort: event.target.value, page: 1 }))}>
              <option value="newest">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <ProductFilters categories={categories} brands={brands} filters={filters} setFilters={setFilters} />
        </div>
        <div>
          <ProductGrid products={data.products} loading={loading} />
          <Pagination pagination={data.pagination} onPageChange={(page) => setFilters((state) => ({ ...state, page }))} />
        </div>
      </div>
    </main>
  );
}
