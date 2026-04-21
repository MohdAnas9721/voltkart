import { ChevronDown, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { nestCategories } from '../../utils/categories';

export default function CategorySidebar({ categories = [], mobileOpen = false, onClose, showDesktop = true }) {
  const [open, setOpen] = useState({});
  const nested = nestCategories(categories);
  const content = (
    <div className="h-full bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="flex items-center gap-2 font-bold text-slate-950"><Zap className="h-5 w-5 text-primary-600" /> Shop Categories</h2>
        <button type="button" onClick={onClose} className="lg:hidden"><X className="h-5 w-5" /></button>
      </div>
      <div className="p-2">
        {nested.map((category) => (
          <div key={category._id} className="rounded-md">
            <div className="flex items-center">
              <Link to={`/category/${category.slug}`} onClick={onClose} className="flex-1 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                {category.name}
              </Link>
              <button type="button" onClick={() => setOpen((state) => ({ ...state, [category._id]: !state[category._id] }))} className="rounded p-2 hover:bg-slate-50">
                <ChevronDown className={`h-4 w-4 transition ${open[category._id] ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {open[category._id] !== false && (
              <div className="ml-3 border-l border-slate-200 pl-2">
                {category.children.map((child) => (
                  <Link key={child._id} to={`/category/${child.slug}`} onClick={onClose} className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-700">
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {showDesktop && (
        <aside className="hidden w-72 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">{content}</aside>
      )}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/40" onClick={onClose} aria-label="Close categories" />
          <div className="relative z-[91] h-full w-80 max-w-[88vw] shadow-soft">{content}</div>
        </div>
      )}
    </>
  );
}
