import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Response interceptor to normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const normalized = {
        message: error.response.data?.message || error.message || 'Request failed',
        status: error.response.status,
        data: error.response.data,
      };
      return Promise.reject(normalized);
    }
    return Promise.reject({ message: error.message || 'Request failed', status: 0 });
  }
);

// Food Service
export const foodService = {
  getFoodItems: () => api.get('/food'),
  likeFood: (foodId) => api.post('/food/like', { foodId }),
  saveFood: (foodId) => api.post('/food/save', { foodId }),
  getSavedFoodItems: () => api.get('/food/saved'),
  createFood: (formData) => api.post('/food', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateFood: (id, data) => api.patch(`/food/${id}`, data),
  deleteFood: (id) => api.delete(`/food/${id}`),
  addComment: (foodId, text, parent) => api.post('/food/comment', { foodId, text, parent }),
  getComments: (foodId) => api.get(`/food/${foodId}/comments`),
  deleteComment: (commentId) => api.delete(`/food/comment/${commentId}`),
  likeComment: (commentId) => api.post('/food/comment/like', { commentId }),
};

// Auth Service
export const authService = {
  loginUser: (credentials) => api.post('/auth/user/login', credentials),
  registerUser: (userData) => api.post('/auth/user/register', userData),
  getUserProfile: () => api.get('/auth/user/profile'),
  updateUserProfile: (data) => api.patch('/auth/user/profile', data),
  loginFoodPartner: (credentials) => api.post('/auth/foodpartner/login', credentials),
  registerFoodPartner: (userData) => api.post('/auth/foodpartner/register', userData),
  logoutUser: () => api.get('/auth/user/logout'),
  logoutFoodPartner: () => api.get('/auth/foodpartner/logout'),
};

// Food Partner Service
export const foodPartnerService = {
  getFoodPartnerById: (id) => api.get(`/food-partner/${id}`),
  getFoodPartnerBySlug: (slug) => api.get(`/food-partner/restaurant/${slug}`),
  getFoodPartnerVideos: (id) => api.get(`/food-partner/${id}/videos`),
  getMyProfile: () => api.get('/food-partner/me'),
  getMyReels: () => api.get('/food-partner/me/reels'),
  updateMyProfile: (data) => api.patch('/food-partner/me', data),
  getPartnerReviews: (id) => api.get(`/reviews/partner/${id}`),
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
  getPartnerReviews: (id) => api.get(`/reviews/partner/${id}`),
};

// Follow Service
export const followService = {
  followPartner: (partnerId) => api.post('/follow/partner', { partnerId }),
  getFollowedPartners: () => api.get('/follow/partners'),
  getFollowedFeed: () => api.get('/follow/feed'),
  getPartnerFollowers: () => api.get('/follow/followers'),
};

// Notification Service
export const notificationService = {
  getUserNotifications: () => api.get('/notifications/user'),
  getPartnerNotifications: () => api.get('/notifications/partner'),
  markUserRead: (id) => api.patch(`/notifications/user/${id}/read`),
  markPartnerRead: (id) => api.patch(`/notifications/partner/${id}/read`)
};
