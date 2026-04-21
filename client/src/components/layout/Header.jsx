import { Heart, Menu, Search, ShoppingCart, User, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/catalogService';
import useDebounce from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getDemoProductImage, getProductImage } from '../../utils/productImages';

export default function Header({ onMenu }) {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const debounced = useDebounce(term, 250);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    if (debounced.length < 2) return setSuggestions([]);
    getProducts({ search: debounced, limit: 5 }).then((data) => setSuggestions(data.products)).catch(() => setSuggestions([]));
  }, [debounced]);

  const submit = (event) => {
    event.preventDefault();
    if (term.trim()) {
      setSuggestions([]);
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-[80] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="bg-slate-950 text-xs text-white">
        <div className="container-page flex items-center justify-between py-2">
          <span>GST invoices, bulk discounts and COD on eligible orders</span>
          <Link to="/contact" className="hidden hover:text-primary-100 sm:block">Need help? Contact sales</Link>
        </div>
      </div>
      <div className="container-page flex min-h-20 items-center gap-3 py-3">
        <button type="button" onClick={onMenu} className="rounded-md border border-slate-200 p-2 lg:hidden" aria-label="Open categories">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-600 text-white">
            <Zap className="h-6 w-6" />
          </span>
          VoltKart
        </Link>

        <form onSubmit={submit} className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            className="input h-11 pl-10"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search wires, MCB, LED lights, switches..."
          />
          {suggestions.length > 0 && (
            <div className="absolute top-12 z-[120] w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.slug}`}
                  onClick={() => setSuggestions([])}
                  className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0 hover:bg-slate-50"
                >
                  <img src={getProductImage(product)} onError={(event) => { event.currentTarget.src = getDemoProductImage(product); }} alt={product.name} className="h-10 w-10 rounded object-cover" />
                  <span className="font-medium">{product.name}</span>
                </Link>
              ))}
            </div>
          )}
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={() => setMobileSearchOpen((value) => !value)} className="rounded-md p-2 hover:bg-slate-100 md:hidden" aria-label="Search">
            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <Link to="/wishlist" className="relative rounded-md p-2 hover:bg-slate-100" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.items.length > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-copper px-1.5 text-[10px] font-bold text-white">{wishlist.items.length}</span>}
          </Link>
          <Link to="/cart" className="relative rounded-md p-2 hover:bg-slate-100" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          {user ? (
            <div className="group relative">
              <button type="button" onClick={() => setAccountOpen((value) => !value)} className="flex items-center gap-2 rounded-md p-2 hover:bg-slate-100" aria-expanded={accountOpen}>
                <User className="h-5 w-5" />
                <span className="hidden max-w-24 truncate text-sm font-semibold sm:inline">{user.name}</span>
              </button>
              <div className={`${accountOpen ? 'visible opacity-100' : 'invisible opacity-0'} absolute right-0 top-11 z-[120] w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-soft transition group-hover:visible group-hover:opacity-100`}>
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-black text-slate-950">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
                <Link to="/profile" onClick={() => setAccountOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-slate-50">Profile</Link>
                <Link to="/orders" onClick={() => setAccountOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-slate-50">My Orders</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setAccountOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-slate-50">Admin Dashboard</Link>}
                {user.role === 'delivery' && <Link to="/delivery" onClick={() => setAccountOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-slate-50">Delivery Dashboard</Link>}
                <button type="button" onClick={() => { setAccountOpen(false); logout(); }} className="w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-50">Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-md p-2 hover:bg-slate-100 sm:hidden" aria-label="Login"><User className="h-5 w-5" /></Link>
              <Link to="/login" className="btn-secondary hidden sm:inline-flex">Login</Link>
            </>
          )}
        </div>
      </div>
      {mobileSearchOpen && (
        <div className="container-page relative pb-3 md:hidden">
          <form onSubmit={submit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              className="input h-11 pl-10"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search electrical products..."
              autoFocus
            />
          </form>
          {suggestions.length > 0 && (
            <div className="absolute left-4 right-4 top-14 z-[120] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.slug}`}
                  onClick={() => { setSuggestions([]); setMobileSearchOpen(false); }}
                  className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0 hover:bg-slate-50"
                >
                  <img src={getProductImage(product)} onError={(event) => { event.currentTarget.src = getDemoProductImage(product); }} alt={product.name} className="h-10 w-10 rounded object-cover" />
                  <span className="font-medium">{product.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="hidden border-t border-slate-100 md:block">
        <nav className="container-page flex gap-6 overflow-x-auto py-3 text-sm font-semibold text-slate-700">
          <NavLink to="/products" className="hover:text-primary-700">All Products</NavLink>
          <NavLink to="/category/wires-cables" className="hover:text-primary-700">Wires & Cables</NavLink>
          <NavLink to="/category/lighting" className="hover:text-primary-700">Lighting</NavLink>
          <NavLink to="/category/protection-devices" className="hover:text-primary-700">MCB/RCCB</NavLink>
          <NavLink to="/category/switches-accessories" className="hover:text-primary-700">Switches</NavLink>
          <NavLink to="/category/fans-appliances" className="hover:text-primary-700">Fans</NavLink>
          <NavLink to="/category/tools-utilities" className="hover:text-primary-700">Tools</NavLink>
        </nav>
      </div>
    </header>
  );
}
