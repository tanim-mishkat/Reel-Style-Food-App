// Route configuration
export const ROUTES = {
  HOME: '/',
  SAVED: '/saved',
  USER_SAVED_VIDEOS: '/saved/videos',
  
  // Auth routes
  USER_LOGIN: '/auth/user/login',
  USER_REGISTER: '/auth/user/register',
  USER_LOGOUT: '/auth/user/logout',
  FOOD_PARTNER_LOGIN: '/auth/food-partner/login',
  FOOD_PARTNER_REGISTER: '/auth/food-partner/register',
  FOOD_PARTNER_LOGOUT: '/auth/food-partner/logout',
  
  // Food Partner routes
  CREATE_FOOD: '/create-food',
  DASHBOARD: '/dashboard',
  FOOD_PARTNER_PROFILE: '/food-partner/:id',
  FOOD_PARTNER_VIDEOS: '/food-partner/:id/videos',
  
  // Checkout routes
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
};

// Route groups for easier management
export const PUBLIC_ROUTES = [
  ROUTES.USER_LOGIN,
  ROUTES.USER_REGISTER,
  ROUTES.FOOD_PARTNER_LOGIN,
  ROUTES.FOOD_PARTNER_REGISTER,
];

export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.SAVED,
  ROUTES.USER_SAVED_VIDEOS,
  ROUTES.CREATE_FOOD,
  ROUTES.FOOD_PARTNER_PROFILE,
  ROUTES.FOOD_PARTNER_VIDEOS,
];