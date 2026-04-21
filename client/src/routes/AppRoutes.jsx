import { Route, Routes } from 'react-router-dom';
import StoreLayout from '../components/layout/StoreLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/store/HomePage';
import ProductListingPage from '../pages/store/ProductListingPage';
import ProductDetailsPage from '../pages/store/ProductDetailsPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import OrderSuccessPage from '../pages/store/OrderSuccessPage';
import WishlistPage from '../pages/store/WishlistPage';
import LoginPage from '../pages/store/LoginPage';
import RegisterPage from '../pages/store/RegisterPage';
import ProfilePage from '../pages/store/ProfilePage';
import MyOrdersPage from '../pages/store/MyOrdersPage';
import OrderTrackingPage from '../pages/store/OrderTrackingPage';
import StaticPage from '../pages/store/StaticPage';
import NotFoundPage from '../pages/store/NotFoundPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminBrandsPage from '../pages/admin/AdminBrandsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminBannersPage from '../pages/admin/AdminBannersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminCouponsPage from '../pages/admin/AdminCouponsPage';
import AdminDeliveryBoysPage from '../pages/admin/AdminDeliveryBoysPage';
import DeliveryDashboardPage from '../pages/delivery/DeliveryDashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListingPage />} />
        <Route path="category" element={<ProductListingPage title="Categories" />} />
        <Route path="category/:slug" element={<ProductListingPage />} />
        <Route path="search" element={<ProductListingPage searchMode />} />
        <Route path="product/:slug" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="about" element={<StaticPage type="about" />} />
        <Route path="contact" element={<StaticPage type="contact" />} />
        <Route path="privacy-policy" element={<StaticPage type="privacy" />} />
        <Route path="terms" element={<StaticPage type="terms" />} />
        <Route path="return-policy" element={<StaticPage type="return" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success/:id" element={<OrderSuccessPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="orders/:id" element={<OrderTrackingPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute admin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="delivery-boys" element={<AdminDeliveryBoysPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute delivery />}>
        <Route path="/delivery" element={<DeliveryDashboardPage />} />
      </Route>
    </Routes>
  );
}
