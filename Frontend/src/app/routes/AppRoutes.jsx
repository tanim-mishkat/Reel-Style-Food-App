import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLoginPage from "../../features/auth/pages/UserLoginPage";
import UserRegisterPage from "../../features/auth/pages/UserRegisterPage";
import FoodPartnerLoginPage from "../../features/auth/pages/FoodPartnerLoginPage";
import FoodPartnerRegisterPage from "../../features/auth/pages/FoodPartnerRegisterPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/food-partner/login" element={<FoodPartnerLoginPage />} />
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegisterPage />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
