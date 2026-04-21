import api from './api';

export const getProducts = (params) => api.get('/products', { params }).then((res) => res.data);
export const getProduct = (slug) => api.get(`/products/${slug}`).then((res) => res.data);
export const getCategories = () => api.get('/categories').then((res) => res.data);
export const getBrands = () => api.get('/brands').then((res) => res.data);
export const getBanners = () => api.get('/banners').then((res) => res.data);
export const getSettings = () => api.get('/settings').then((res) => res.data);
export const getReviews = (productId) => api.get(`/products/${productId}/reviews`).then((res) => res.data);
export const createReview = (payload) => api.post('/reviews', payload).then((res) => res.data);
