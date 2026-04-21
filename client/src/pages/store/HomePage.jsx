import { ArrowRight, BadgePercent, Cable, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import CategorySidebar from '../../components/layout/CategorySidebar';
import ProductCard from '../../components/product/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { getBanners, getBrands, getProducts } from '../../services/catalogService';

const HOME_PRODUCT_LIMIT = 20;

export default function HomePage() {
  const { categories } = useOutletContext();
  const [banners, setBanners] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBanners(),
      getProducts({ featured: true, limit: HOME_PRODUCT_LIMIT }),
      getProducts({ sort: 'discount', limit: HOME_PRODUCT_LIMIT }),
      getProducts({ sort: 'newest', limit: HOME_PRODUCT_LIMIT }),
      getBrands()
    ]).then(([bannerData, featuredData, discountData, newData, brandData]) => {
      setBanners(bannerData);
      setFeatured(featuredData.products);
      setDiscounts(discountData.products);
      setNewArrivals(newData.products);
      setBrands(brandData);
    }).finally(() => setLoading(false));
  }, []);

  const hero = banners[0];
  const subCategories = categories.filter((category) => category.parentCategory).slice(0, 12);

  return (
    <main>
      <section className="container-page mt-6 flex gap-6 lg:mt-4 lg:items-start">
        <CategorySidebar categories={categories} />
        <div className="min-w-0 flex-1">
          <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
            <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-soft">
              <div className="grid min-h-[380px] gap-6 p-8 md:grid-cols-[1.1fr_.9fr] md:p-10">
                <div className="flex flex-col justify-center">
                  <p className="mb-3 inline-flex w-fit items-center gap-2 rounded bg-white/10 px-3 py-1 text-sm font-semibold">
                    <Sparkles className="h-4 w-4" /> Contractor-ready marketplace
                  </p>
                  <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
                    {hero?.title || 'Professional Electrical Supplies'}
                  </h1>
                  <p className="mt-4 max-w-xl text-slate-300">
                    {hero?.subtitle || 'Browse certified wires, cables, MCB, RCCB, lighting, switches, fans and tools with clear pricing.'}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/products" className="btn-primary">Shop Products <ArrowRight className="h-4 w-4" /></Link>
                    <Link to="/category/wires-cables" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950">Bulk Wires</Link>
                  </div>
                </div>
                <div className="relative hidden items-center justify-center md:flex">
                  <img src={hero?.image} alt={hero?.title} className="h-72 w-full rounded-lg object-cover" />
                </div>
              </div>
            </div>
            <div className="grid gap-5">
              <Link to="/category/protection-devices" className="rounded-lg bg-primary-600 p-6 text-white shadow-soft">
                <ShieldCheck className="mb-5 h-9 w-9" />
                <h2 className="text-2xl font-black">MCB, RCCB & RCBO</h2>
                <p className="mt-2 text-sm text-primary-50">Upgrade protection devices for safer distribution boards.</p>
              </Link>
              <Link to="/category/lighting" className="rounded-lg bg-white p-6 shadow-soft">
                <BadgePercent className="mb-5 h-9 w-9 text-copper" />
                <h2 className="text-2xl font-black text-slate-950">Lighting Offers</h2>
                <p className="mt-2 text-sm text-slate-500">LED bulbs, panels and flood lights with sharp savings.</p>
              </Link>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              [Truck, 'Fast dispatch', 'Quick delivery for stocked electrical products'],
              [Cable, 'Bulk cable pricing', 'Transparent deals for project quantities'],
              [ShieldCheck, 'Trusted brands', 'Polycab, Havells, Legrand, Schneider and more']
            ].map(([Icon, title, text]) => (
              <div key={title} className="card flex items-center gap-4 p-4">
                <Icon className="h-8 w-8 text-primary-600" />
                <div><p className="font-bold">{title}</p><p className="text-sm text-slate-500">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Featured Categories</h2>
          <Link to="/category" className="text-sm font-bold text-primary-700">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {subCategories.map((category) => (
            <Link key={category._id} to={`/category/${category.slug}`} className="card p-4 transition hover:-translate-y-1 hover:border-primary-400 hover:shadow-soft">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-md bg-primary-50 text-primary-700">
                <Cable className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-950">{category.name}</h3>
              <p className="mt-1 text-sm text-slate-500">Shop now</p>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection title="Discount Products" products={discounts} loading={loading} link="/products?sort=discount" />
      <section className="container-page mt-10">
        <h2 className="section-title mb-5">Popular Brands</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {brands.slice(0, 10).map((brand) => (
            <Link key={brand._id} to={`/products?brand=${brand.slug}`} className="card flex items-center gap-3 p-4 hover:border-primary-400">
              <img src={brand.logo} alt={brand.name} className="h-12 w-12 rounded object-cover" />
              <span className="font-bold">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <ProductSection title="Best Selling Products" products={featured} loading={loading} link="/products?sort=popularity" />
      <ProductSection title="New Arrivals" products={newArrivals} loading={loading} link="/products?sort=newest" />
    </main>
  );
}

function ProductSection({ title, products, loading, link }) {
  return (
    <section className="container-page mt-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="section-title">{title}</h2>
        <Link to={link} className="text-sm font-bold text-primary-700">View all</Link>
      </div>
      {loading ? <LoadingSkeleton rows={HOME_PRODUCT_LIMIT} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, HOME_PRODUCT_LIMIT).map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </section>
  );
}
