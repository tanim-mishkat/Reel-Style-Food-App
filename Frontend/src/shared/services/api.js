// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // always send cookies (user_token / partner_token)
});

// Add CSRF token to all requests
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

// --- Error normalization ---
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Suppress console errors for expected 401s
    if (err.response?.status === 401) {
      return Promise.reject({
        message: err.response.data?.message || 'Unauthorized',
        status: 401,
        data: err.response.data,
      });
    }
    if (err.response) {
      return Promise.reject({
        message: err.response.data?.message || err.message || 'Request failed',
        status: err.response.status,
        data: err.response.data,
      });
    }
    return Promise.reject({ message: err.message || 'Request failed', status: 0 });
  }
);

// ====================== Food ======================
export const foodService = {
  getFoodItems: () => api.get('/food'),
  likeFood: (foodId) => api.post('/food/like', { foodId }),
  saveFood: (foodId) => api.post('/food/save', { foodId }),
  getSavedFoodItems: () => api.get('/food/saved'),
  createFood: (formData) => api.post('/food', formData),
  updateFood: (id, data) => api.patch(`/food/${id}`, data),
  deleteFood: (id) => api.delete(`/food/${id}`),
  addComment: (foodId, text, parent) => api.post('/food/comment', { foodId, text, parent }),
  getComments: (foodId) => api.get(`/food/${foodId}/comments`),
  deleteComment: (commentId) => api.delete(`/food/comment/${commentId}`),
  likeComment: (commentId) => api.post('/food/comment/like', { commentId }),
};

// ====================== Auth ======================
export const authService = {
  loginUser: (credentials) => api.post('/auth/user/login', credentials),
  registerUser: (data) => api.post('/auth/user/register', data),
  getUserProfile: () => api.get('/auth/user/profile'),
  updateUserProfile: (data) => api.patch('/auth/user/profile', data),
  loginFoodPartner: (credentials) => api.post('/auth/food-partner/login', credentials),
  registerFoodPartner: (data) => api.post('/auth/food-partner/register', data),
  logoutUser: () => api.get('/auth/user/logout'),
  logoutFoodPartner: () => api.get('/auth/food-partner/logout'),
};

// ====================== Food Partner ======================
export const foodPartnerService = {
  getFoodPartnerById: (id) => api.get(`/food-partner/${id}`),
  getFoodPartnerBySlug: (slug) => api.get(`/food-partner/restaurant/${slug}`),
  getFoodPartnerVideos: (id) => api.get(`/food-partner/${id}/videos`),
  getMyProfile: () => api.get('/food-partner/me'),
  getMyReels: () => api.get('/food-partner/me/reels'),
  updateMyProfile: (data) => api.patch('/food-partner/me', data),
};

// ====================== Menu ======================
export const menuService = {
  createMenuItem: (data) => api.post('/menu', data),
  getMyMenuItems: () => api.get('/menu/me'),
  getMenuItems: (partnerId) => api.get(`/menu/${partnerId}`),
  updateMenuItem: (id, data) => api.patch(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
};

// ====================== Orders ======================
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/user'),
  getPartnerOrders: (status) =>
    api.get(`/orders/partner/orders${status ? `?status=${status}` : ''}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  batchUpdateOrderStatus: (orderIds, status) =>
    api.patch('/orders/batch/status', { orderIds, status }),
};

// ====================== Reviews ======================
export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getPartnerReviews: (id) => api.get(`/reviews/partner/${id}`),
};

// ====================== Follow ======================
export const followService = {
  toggleFollow: (partnerId) => api.post('/follow/partner', { partnerId }),
  getFollowedPartners: () => api.get('/follow/partners'),
  getFollowedFeed: () => api.get('/follow/feed'),
  getPartnerFollowers: () => api.get('/follow/followers'),
  getFollowerCount: (partnerId) => api.get(`/follow/count/${partnerId}`),
};

// ====================== Notifications ======================
export const notificationService = {
  getUserNotifications: () => api.get('/notifications/user'),
  getPartnerNotifications: () => api.get('/notifications/partner'),
  markUserRead: (id) => api.patch(`/notifications/user/${id}/read`),
  markPartnerRead: (id) => api.patch(`/notifications/partner/${id}/read`),
};