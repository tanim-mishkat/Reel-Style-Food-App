import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/api";
import { ROUTES } from "../../../routes/routeConfig";
import Loading from "../ui/Loading/Loading";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.getUserProfile();
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Authentication check failed:", error.message);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loading>Checking authentication...</Loading>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={ROUTES.USER_LOGIN} state={{ from: location }} replace />
  );
};

export default PrivateRoute;
