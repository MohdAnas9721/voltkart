import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totals: { subtotal: 0, shippingCharge: 0, discountAmount: 0, taxAmount: 0, totalAmount: 0 } });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totals: { subtotal: 0, shippingCharge: 0, discountAmount: 0, taxAmount: 0, totalAmount: 0 } });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add products to cart');
      return false;
    }
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data);
    toast.success('Added to cart');
    return true;
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data);
    toast.success('Removed from cart');
  };

  useEffect(() => {
    fetchCart();
  }, [user?._id]);

  const value = useMemo(
    () => ({ cart, loading, fetchCart, addToCart, updateQuantity, removeItem, count: cart.items.reduce((sum, item) => sum + item.quantity, 0) }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
