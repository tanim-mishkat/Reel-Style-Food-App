import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Food Service
export const foodService = {
  getFoodItems: () => api.get('/food'),
  likeFood: (foodId) => api.post('/food/like', { foodId }),
  saveFood: (foodId) => api.post('/food/save', { foodId }),
  getSavedFoodItems: () => api.get('/food/saved'),
  createFood: (formData) => api.post('/food', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addComment: (foodId, text) => api.post('/food/comment', { foodId, text }),
  getComments: (foodId) => api.get(`/food/${foodId}/comments`),
};

// Auth Service
export const authService = {
  loginUser: (credentials) => api.post('/auth/user/login', credentials),
  registerUser: (userData) => api.post('/auth/user/register', userData),
  loginFoodPartner: (credentials) => api.post('/auth/foodpartner/login', credentials),
  registerFoodPartner: (userData) => api.post('/auth/foodpartner/register', userData),
  logoutUser: () => api.get('/auth/user/logout'),
  logoutFoodPartner: () => api.get('/auth/foodpartner/logout'),
};

// Food Partner Service
export const foodPartnerService = {
  getFoodPartnerById: (id) => api.get(`/food-partner/${id}`),
  getFoodPartnerVideos: (id) => api.get(`/food-partner/${id}/videos`),
  getMyProfile: () => api.get('/food-partner/me'),
  updateMyProfile: (data) => api.patch('/food-partner/me', data),
  getPartnerReviews: (id) => api.get(`/food-partner/${id}/reviews`),
};

// Menu Service
export const menuService = {
  createMenuItem: (data) => api.post('/menu', data),
  getMyMenuItems: () => api.get('/menu/me'),
  getMenuItems: (partnerId) => api.get(`/menu/${partnerId}`),
  updateMenuItem: (id, data) => api.patch(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
};

// Order Service
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/user'),
  getPartnerOrders: (status) => api.get(`/orders/partner/orders${status ? `?status=${status}` : ''}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Review Service
export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
};