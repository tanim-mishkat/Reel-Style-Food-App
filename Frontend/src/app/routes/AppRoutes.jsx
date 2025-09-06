import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLoginPage from "../../features/auth/pages/UserLoginPage";
import UserRegisterPage from "../../features/auth/pages/UserRegisterPage";
import FoodPartnerLoginPage from "../../features/auth/pages/FoodPartnerLoginPage";
import FoodPartnerRegisterPage from "../../features/auth/pages/FoodPartnerRegisterPage";
import Home from "../../features/user/Home";
import Saved from "../../features/user/Saved";
import CreateFood from "../../features/food-partner/CreateFood.jsx";
import Profile from "../../features/food-partner/Profile.jsx";

const NotFoundPage = () => (
  <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>
);

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:id" element={<Profile />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/food-partner/login" element={<FoodPartnerLoginPage />} />
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegisterPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
