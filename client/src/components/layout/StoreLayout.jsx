import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getCategories } from '../../services/catalogService';
import CategorySidebar from './CategorySidebar';
import Footer from './Footer';
import Header from './Header';

export default function StoreLayout() {
  const [categories, setCategories] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onMenu={() => setMobileMenu(true)} />
      <CategorySidebar categories={categories} mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} showDesktop={false} />
      <Outlet context={{ categories }} />
      <Footer />
    </div>
  );
}
