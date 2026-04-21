import { Mail, MapPin, Phone, ShieldCheck, Truck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-white">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-600">
              <Zap className="h-6 w-6" />
            </span>
            VoltKart
          </Link>
          <p className="text-sm leading-6 text-slate-400">
            Electrical products for homes, contractors and industrial buyers with trusted brands and transparent pricing.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Shop</h3>
          <div className="grid gap-2 text-sm">
            <Link to="/products">All Products</Link>
            <Link to="/category/wires-cables">Wires & Cables</Link>
            <Link to="/category/protection-devices">Protection Devices</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Policies</h3>
          <div className="grid gap-2 text-sm">
            <Link to="/about">About</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/return-policy">Return Policy</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-bold text-white">Contact</h3>
          <p className="flex gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</p>
          <p className="flex gap-2"><Mail className="h-4 w-4" /> support@voltkart.example</p>
          <p className="flex gap-2"><MapPin className="h-4 w-4" /> Pune, Maharashtra</p>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col gap-3 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>© 2026 VoltKart Electricals. All rights reserved.</span>
          <span className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-1"><Truck className="h-4 w-4" /> Fast dispatch</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> GST-ready invoices</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
