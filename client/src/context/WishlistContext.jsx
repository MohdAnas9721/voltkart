import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [] });

  const fetchWishlist = async () => {
    if (!user) return setWishlist({ items: [] });
    const { data } = await api.get('/wishlist');
    setWishlist(data);
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    const exists = wishlist.items.some((item) => item._id === product._id);
    const { data } = exists
      ? await api.delete(`/wishlist/${product._id}`)
      : await api.post('/wishlist', { productId: product._id });
    setWishlist(data);
    toast.success(exists ? 'Removed from wishlist' : 'Added to wishlist');
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?._id]);

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, isWished: (id) => wishlist.items.some((item) => item._id === id) }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
