// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // always send cookies (user_token / partner_token)
});

// Store CSRF token in memory as fallback
let memoryCSRFToken = null;

// Helper function to get CSRF token from cookie or memory
const getCSRFToken = () => {
  // Try to get from cookie first
  const cookieToken = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('csrf_token='))
    ?.substring('csrf_token='.length);

  return cookieToken || memoryCSRFToken;
};

// Helper function to ensure CSRF token is available
const ensureCsrfToken = async () => {
  let csrfToken = getCSRFToken();

  if (!csrfToken) {
    // Make a GET request to trigger CSRF token creation
    try {
      const response = await api.get('/init-csrf');

      // Try to get token from response header as fallback
      const headerToken = response.headers['x-csrf-token'];
      if (headerToken) {
        memoryCSRFToken = headerToken;
      }

      // Wait a bit and check again for the cookie
      await new Promise(resolve => setTimeout(resolve, 200));

      csrfToken = getCSRFToken();
    } catch (error) {
      // Silent fail - CSRF will be handled by interceptors
    }
  }
};

// Initialize CSRF token when the module loads
export const initializeCSRF = ensureCsrfToken;

// Add CSRF token to all requests
api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();

  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

// --- Error normalization ---
api.interceptors.response.use(
  (res) => {
    // Capture CSRF token from response headers if available
    const headerToken = res.headers['x-csrf-token'];
    if (headerToken && headerToken !== memoryCSRFToken) {
      memoryCSRFToken = headerToken;
    }
    return res;
  },
  async (err) => {
    // Handle CSRF token issues
    if (err.response?.status === 403 && err.response?.data?.message === 'Invalid CSRF token') {
      try {
        // Clear existing token and get a new one
        document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        await api.get('/health');

        // Retry the original request
        const originalRequest = err.config;
        const newCsrfToken = getCSRFToken();

        if (newCsrfToken) {
          originalRequest.headers['x-csrf-token'] = newCsrfToken;
          return api.request(originalRequest);
        }
      } catch (refreshError) {
        // Silent fail
      }
    }

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
  likeFood: async (foodId) => {
    await ensureCsrfToken();
    return api.post('/food/like', { foodId });
  },
  saveFood: async (foodId) => {
    await ensureCsrfToken();
    return api.post('/food/save', { foodId });
  },
  getSavedFoodItems: () => api.get('/food/saved'),
  createFood: async (formData) => {
    await ensureCsrfToken();
    return api.post('/food', formData);
  },
  updateFood: async (id, data) => {
    await ensureCsrfToken();
    return api.patch(`/food/${id}`, data);
  },
  deleteFood: async (id) => {
    await ensureCsrfToken();
    return api.delete(`/food/${id}`);
  },
  addComment: async (foodId, text, parent) => {
    await ensureCsrfToken();
    return api.post('/food/comment', { foodId, text, parent });
  },
  getComments: (foodId) => api.get(`/food/${foodId}/comments`),
  deleteComment: async (commentId) => {
    await ensureCsrfToken();
    return api.delete(`/food/comment/${commentId}`);
  },
  likeComment: async (commentId) => {
    await ensureCsrfToken();
    return api.post('/food/comment/like', { commentId });
  },
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
  toggleFollow: async (partnerId) => {
    await ensureCsrfToken();
    return api.post('/follow/partner', { partnerId });
  },
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