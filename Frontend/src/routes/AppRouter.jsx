import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig";
import PrivateRoute from "../shared/components/auth/PrivateRoute";
import PartnerPrivateRoute from "../shared/components/auth/PartnerPrivateRoute";
import Navbar from "../shared/components/layout/Navbar";

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
import PartnerReelsPage from "../features/foodPartner/pages/PartnerReelsPage";
import ProfilePage from "../features/foodPartner/pages/ProfilePage";
import FoodPartnerVideosPage from "../features/foodPartner/pages/FoodPartnerVideosPage";

// Store Pages
import StorePage from "../features/store/pages/StorePage";

// Checkout Pages
import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import PaymentPage from "../features/checkout/pages/PaymentPage";

// Order Pages
import OrderDetailPage from "../features/orders/pages/OrderDetailPage";
import UserOrdersPage from "../features/orders/pages/UserOrdersPage";

// User Pages
import UserDashboardPage from "../features/user/pages/UserDashboardPage";

// Following Page
import FollowingPage from "../features/home/pages/FollowingPage";

import Loading from "../shared/components/ui/Loading/Loading";

const NotFoundPage = () => <Loading>404 - Page Not Found</Loading>;

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Home Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route
            path={ROUTES.SAVED}
            element={
              <PrivateRoute>
                <SavedPage />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.USER_SAVED_VIDEOS}
            element={
              <PrivateRoute>
                <UserSavedVideosPage />
              </PrivateRoute>
            }
          />

          {/* Auth Routes */}
          <Route path={ROUTES.USER_LOGIN} element={<UserLoginPage />} />
          <Route path={ROUTES.USER_REGISTER} element={<UserRegisterPage />} />
          <Route path={ROUTES.USER_LOGOUT} element={<UserLogoutPage />} />
          <Route
            path={ROUTES.FOOD_PARTNER_LOGIN}
            element={<FoodPartnerLoginPage />}
          />
          <Route
            path={ROUTES.FOOD_PARTNER_REGISTER}
            element={<FoodPartnerRegisterPage />}
          />
          <Route
            path={ROUTES.FOOD_PARTNER_LOGOUT}
            element={<FoodPartnerLogoutPage />}
          />

          {/* Food Partner Routes */}
          <Route
            path={ROUTES.CREATE_FOOD}
            element={
              <PartnerPrivateRoute>
                <CreateFoodPage />
              </PartnerPrivateRoute>
            }
          />
          <Route
            path={ROUTES.PARTNER_DASHBOARD}
            element={
              <PartnerPrivateRoute>
                <DashboardPage />
              </PartnerPrivateRoute>
            }
          />
          <Route
            path={ROUTES.PARTNER_REELS}
            element={
              <PartnerPrivateRoute>
                <PartnerReelsPage />
              </PartnerPrivateRoute>
            }
          />
          <Route path={ROUTES.FOOD_PARTNER_PROFILE} element={<ProfilePage />} />
          <Route
            path={ROUTES.FOOD_PARTNER_VIDEOS}
            element={<FoodPartnerVideosPage />}
          />

          {/* Store Routes */}
          <Route path={ROUTES.STORE} element={<StorePage />} />

          {/* Checkout Routes */}
          <Route
            path={ROUTES.CHECKOUT}
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.PAYMENT}
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            }
          />

          {/* Order Routes */}
          <Route
            path={ROUTES.USER_ORDERS}
            element={
              <PrivateRoute>
                <UserOrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.ORDER_DETAIL}
            element={
              <PrivateRoute>
                <OrderDetailPage />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path={ROUTES.USER_DASHBOARD}
            element={
              <PrivateRoute>
                <UserDashboardPage />
              </PrivateRoute>
            }
          />

          {/* Following Route */}
          <Route
            path="/following"
            element={
              <PrivateRoute>
                <FollowingPage />
              </PrivateRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
