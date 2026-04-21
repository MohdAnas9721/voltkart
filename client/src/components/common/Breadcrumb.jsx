import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-primary-700">
        <Home className="h-4 w-4" />
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {item.to ? (
            <Link to={item.to} className="hover:text-primary-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
