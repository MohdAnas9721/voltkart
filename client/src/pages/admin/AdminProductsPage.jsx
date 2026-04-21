import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminTable from '../../components/admin/AdminTable';
import SpecificationInput from '../../components/admin/SpecificationInput';
import { adminApi } from '../../services/adminService';
import { formatCurrency } from '../../utils/currency';

const empty = {
  name: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  subcategory: '',
  brand: '',
  sku: '',
  images: '',
  price: '',
  originalPrice: '',
  stock: '',
  specifications: [],
  featured: false,
  isActive: true,
  tags: '',
  shippingCharge: 99,
  dispatchTime: 1,
  estimatedDispatchDays: 1,
  estimatedDeliveryDaysMin: 3,
  estimatedDeliveryDaysMax: 5,
  warrantyAvailable: true,
  warrantyText: '2 Years Manufacturer Warranty',
  returnAvailable: true,
  returnWindowDays: 7,
  returnPolicyText: 'Return available for unused products in original packaging.',
  openBoxDeliveryAvailable: false,
  openBoxDeliveryText: 'Open box inspection is available before accepting delivery.',
  codAvailable: true,
  deliveryChargeType: 'conditional',
  fixedDeliveryCharge: 99,
  freeDeliveryMinOrderAmount: 2500,
  weight: 1
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => Promise.all([
    adminApi.products({ limit: 48 }),
    adminApi.categories(),
    adminApi.brands()
  ]).then(([productData, categoryData, brandData]) => {
    setProducts(productData.products);
    setCategories(categoryData);
    setBrands(brandData);
  });

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      // Convert specification array to object for backend
      const specificationsObj = {};
      if (Array.isArray(form.specifications)) {
        form.specifications.forEach(spec => {
          if (spec.name && spec.value) {
            specificationsObj[spec.name] = spec.value;
          }
        });
      }

      const payload = {
        ...form,
        images: String(form.images).split(',').map((item) => item.trim()).filter(Boolean),
        tags: String(form.tags).split(',').map((item) => item.trim()).filter(Boolean),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        stock: Number(form.stock),
        shippingCharge: Number(form.shippingCharge),
        dispatchTime: Number(form.dispatchTime),
        estimatedDispatchDays: Number(form.estimatedDispatchDays || form.dispatchTime),
        estimatedDeliveryDaysMin: Number(form.estimatedDeliveryDaysMin),
        estimatedDeliveryDaysMax: Number(form.estimatedDeliveryDaysMax),
        warrantyAvailable: Boolean(form.warrantyAvailable),
        warrantyText: form.warrantyText,
        returnAvailable: Boolean(form.returnAvailable),
        returnWindowDays: Number(form.returnWindowDays),
        returnPolicyText: form.returnPolicyText,
        openBoxDeliveryAvailable: Boolean(form.openBoxDeliveryAvailable),
        openBoxDeliveryText: form.openBoxDeliveryText,
        codAvailable: Boolean(form.codAvailable),
        deliveryChargeType: form.deliveryChargeType,
        fixedDeliveryCharge: Number(form.fixedDeliveryCharge),
        freeDeliveryMinOrderAmount: Number(form.freeDeliveryMinOrderAmount),
        weight: Number(form.weight),
        specifications: specificationsObj
      };
      if (editing) await adminApi.updateProduct(editing, payload);
      else await adminApi.createProduct(payload);
      toast.success(editing ? 'Product updated' : 'Product created');
      setEditing(null);
      setForm(empty);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product save failed');
    }
  };

  const edit = (product) => {
    setEditing(product._id);
    // Convert specifications object to array format for the component
    const specsArray = Object.entries(product.specifications || {}).map(([name, val]) => ({
      name,
      value: val || ''
    }));
    setForm({
      ...empty,
      ...product,
      category: product.category?._id || product.category,
      subcategory: product.subcategory?._id || '',
      brand: product.brand?._id || product.brand,
      images: product.images?.join(', ') || '',
      tags: product.tags?.join(', ') || '',
      specifications: specsArray
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="card h-fit p-5">
        <h1 className="mb-4 text-2xl font-black">{editing ? 'Edit Product' : 'Add Product'}</h1>
        <div className="grid gap-3">
          <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          <textarea className="input min-h-20" placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required />
          <textarea className="input min-h-20" placeholder="Full description" value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
            <option value="">Category</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <select className="input" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}>
            <option value="">Subcategory</option>
            {categories.filter((category) => category.parentCategory).map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <select className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required>
            <option value="">Brand</option>
            {brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-2">
            <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input" type="number" placeholder="MRP" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} required />
            <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>
          <input className="input" placeholder="Image URLs, comma separated" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          <input className="input" placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="mb-3 text-sm font-black uppercase text-slate-700">Delivery & Policy Settings</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                <input className="input" type="number" min="1" placeholder="Dispatch days" value={form.estimatedDispatchDays} onChange={(e) => setForm({ ...form, estimatedDispatchDays: e.target.value, dispatchTime: e.target.value })} />
                <input className="input" type="number" min="1" placeholder="Min ETA" value={form.estimatedDeliveryDaysMin} onChange={(e) => setForm({ ...form, estimatedDeliveryDaysMin: e.target.value })} />
                <input className="input" type="number" min="1" placeholder="Max ETA" value={form.estimatedDeliveryDaysMax} onChange={(e) => setForm({ ...form, estimatedDeliveryDaysMax: e.target.value })} />
              </div>
              <select className="input" value={form.deliveryChargeType} onChange={(e) => setForm({ ...form, deliveryChargeType: e.target.value })}>
                <option value="free">Free delivery</option>
                <option value="fixed">Fixed delivery charge</option>
                <option value="distance_based">Distance based</option>
                <option value="conditional">Free above minimum order</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input className="input" type="number" min="0" placeholder="Fixed charge" value={form.fixedDeliveryCharge} onChange={(e) => setForm({ ...form, fixedDeliveryCharge: e.target.value, shippingCharge: e.target.value })} />
                <input className="input" type="number" min="0" placeholder="Free above amount" value={form.freeDeliveryMinOrderAmount} onChange={(e) => setForm({ ...form, freeDeliveryMinOrderAmount: e.target.value })} />
              </div>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                {[
                  ['warrantyAvailable', 'Warranty available'],
                  ['returnAvailable', 'Return available'],
                  ['openBoxDeliveryAvailable', 'Open box delivery'],
                  ['codAvailable', 'COD available']
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 font-semibold">
                    <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                    {label}
                  </label>
                ))}
              </div>
              <input className="input" placeholder="Warranty text" value={form.warrantyText || ''} onChange={(e) => setForm({ ...form, warrantyText: e.target.value })} />
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <input className="input" type="number" min="0" placeholder="Return days" value={form.returnWindowDays} onChange={(e) => setForm({ ...form, returnWindowDays: e.target.value })} />
                <input className="input" placeholder="Return policy text" value={form.returnPolicyText || ''} onChange={(e) => setForm({ ...form, returnPolicyText: e.target.value })} />
              </div>
              <input className="input" placeholder="Open box delivery text" value={form.openBoxDeliveryText || ''} onChange={(e) => setForm({ ...form, openBoxDeliveryText: e.target.value })} />
            </div>
          </section>
          <SpecificationInput value={form.specifications} onChange={(specs) => setForm({ ...form, specifications: specs })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <button className="btn-primary" type="submit">{editing ? 'Save Product' : 'Create Product'}</button>
          {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>
      <div>
        <h1 className="mb-4 text-2xl font-black">Product Management</h1>
        <AdminTable
          rows={products}
          columns={[
            { key: 'name', label: 'Product' },
            { key: 'brand', label: 'Brand', render: (row) => row.brand?.name },
            { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
            { key: 'stock', label: 'Stock' },
            { key: 'discountPercent', label: 'Discount', render: (row) => `${row.discountPercent}%` }
          ]}
          renderActions={(row) => (
            <div className="flex justify-end gap-2">
              <button className="btn-secondary px-3 py-1.5" onClick={() => edit(row)}>Edit</button>
              <button className="btn-secondary px-3 py-1.5 text-rose-600" onClick={() => adminApi.deleteProduct(row._id).then(load)}>Delete</button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
