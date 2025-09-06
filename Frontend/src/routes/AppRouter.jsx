import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig";

// Auth Pages
import UserLoginPage from "../features/auth/pages/UserLoginPage";
import UserRegisterPage from "../features/auth/pages/UserRegisterPage";
import FoodPartnerLoginPage from "../features/auth/pages/FoodPartnerLoginPage";
import FoodPartnerRegisterPage from "../features/auth/pages/FoodPartnerRegisterPage";

// Home Pages
import HomePage from "../features/home/pages/HomePage";
import SavedPage from "../features/home/pages/SavedPage";
import UserSavedVideosPage from "../features/home/pages/UserSavedVideosPage";

// Food Partner Pages
import CreateFoodPage from "../features/foodPartner/pages/CreateFoodPage";
import ProfilePage from "../features/foodPartner/pages/ProfilePage";
import FoodPartnerVideosPage from "../features/foodPartner/pages/FoodPartnerVideosPage";

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
        <Route path={ROUTES.FOOD_PARTNER_LOGIN} element={<FoodPartnerLoginPage />} />
        <Route path={ROUTES.FOOD_PARTNER_REGISTER} element={<FoodPartnerRegisterPage />} />
        
        {/* Food Partner Routes */}
        <Route path={ROUTES.CREATE_FOOD} element={<CreateFoodPage />} />
        <Route path={ROUTES.FOOD_PARTNER_PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.FOOD_PARTNER_VIDEOS} element={<FoodPartnerVideosPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;