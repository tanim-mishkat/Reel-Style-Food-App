import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig";

// Auth Pages
import UserLoginPage from "../features/auth/pages/UserLoginPage";
import UserRegisterPage from "../features/auth/pages/UserRegisterPage";
import UserLogoutPage from "../features/auth/pages/UserLogoutPage";
import FoodPartnerLoginPage from "../features/auth/pages/FoodPartnerLoginPage";
import FoodPartnerRegisterPage from "../features/auth/pages/FoodPartnerRegisterPage";
import FoodPartnerLogoutPage from "../features/auth/pages/FoodPartnerLogoutPage";

// Home Pages
import HomePage from "../features/home/pages/HomePage";
import SavedPage from "../features/home/pages/SavedPage";
import UserSavedVideosPage from "../features/home/pages/UserSavedVideosPage";

// Food Partner Pages
import CreateFoodPage from "../features/foodPartner/pages/CreateFoodPage";
import DashboardPage from "../features/foodPartner/pages/DashboardPage";
import ProfilePage from "../features/foodPartner/pages/ProfilePage";
import FoodPartnerVideosPage from "../features/foodPartner/pages/FoodPartnerVideosPage";

// Checkout Pages
import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import PaymentPage from "../features/checkout/pages/PaymentPage";

// Order Pages
import OrderDetailPage from "../features/orders/pages/OrderDetailPage";

const NotFoundPage = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    <h2>404 - Page Not Found</h2>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Home Routes */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SAVED} element={<SavedPage />} />
        <Route path={ROUTES.USER_SAVED_VIDEOS} element={<UserSavedVideosPage />} />
        
        {/* Auth Routes */}
        <Route path={ROUTES.USER_LOGIN} element={<UserLoginPage />} />
        <Route path={ROUTES.USER_REGISTER} element={<UserRegisterPage />} />
        <Route path={ROUTES.USER_LOGOUT} element={<UserLogoutPage />} />
        <Route path={ROUTES.FOOD_PARTNER_LOGIN} element={<FoodPartnerLoginPage />} />
        <Route path={ROUTES.FOOD_PARTNER_REGISTER} element={<FoodPartnerRegisterPage />} />
        <Route path={ROUTES.FOOD_PARTNER_LOGOUT} element={<FoodPartnerLogoutPage />} />
        
        {/* Food Partner Routes */}
        <Route path={ROUTES.CREATE_FOOD} element={<CreateFoodPage />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.FOOD_PARTNER_PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.FOOD_PARTNER_VIDEOS} element={<FoodPartnerVideosPage />} />
        
        {/* Checkout Routes */}
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
        
        {/* Order Routes */}
        <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;