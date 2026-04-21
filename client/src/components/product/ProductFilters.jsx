import { RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function ProductFilters({ categories = [], brands = [], filters, setFilters }) {
  const update = (key, value) => setFilters((state) => ({ ...state, [key]: value, page: 1 }));

  return (
    <aside className="card h-fit p-4 lg:sticky lg:top-36">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-slate-950">
          <SlidersHorizontal className="h-5 w-5 text-primary-600" />
          Filters
        </h2>
        <button type="button" onClick={() => setFilters({ sort: 'newest', page: 1 })} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Clear filters">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-4">
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Category</span>
          <select className="input mt-1" value={filters.category || ''} onChange={(event) => update('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category._id} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Brand</span>
          <select className="input mt-1" value={filters.brand || ''} onChange={(event) => update('brand', event.target.value)}>
            <option value="">All brands</option>
            {brands.map((brand) => <option key={brand._id} value={brand.slug}>{brand.name}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            <span className="mb-1 block">Min price</span>
            <input className="input mt-1" type="number" value={filters.minPrice || ''} onChange={(event) => update('minPrice', event.target.value)} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            <span className="mb-1 block">Max price</span>
            <input className="input mt-1" type="number" value={filters.maxPrice || ''} onChange={(event) => update('maxPrice', event.target.value)} />
          </label>
        </div>
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Availability</span>
          <select className="input mt-1" value={filters.stock || ''} onChange={(event) => update('stock', event.target.value)}>
            <option value="">All</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Minimum rating</span>
          <select className="input mt-1" value={filters.rating || ''} onChange={(event) => update('rating', event.target.value)}>
            <option value="">Any rating</option>
            <option value="4">4 stars and above</option>
            <option value="3">3 stars and above</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Discount</span>
          <select className="input mt-1" value={filters.discount || ''} onChange={(event) => update('discount', event.target.value)}>
            <option value="">Any discount</option>
            <option value="10">10% or more</option>
            <option value="20">20% or more</option>
            <option value="30">30% or more</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Conductor size</span>
          <input className="input mt-1" placeholder="1.5 sq mm" value={filters.conductorSize || ''} onChange={(event) => update('conductorSize', event.target.value)} />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Packing / length</span>
          <input className="input mt-1" placeholder="90 m coil" value={filters.packing || ''} onChange={(event) => update('packing', event.target.value)} />
        </label>
        <button type="button" onClick={() => setFilters({ sort: 'newest', page: 1 })} className="btn-secondary">
          Clear filters
        </button>
      </div>
    </aside>
  );
}
