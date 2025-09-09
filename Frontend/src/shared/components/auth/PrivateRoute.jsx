import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/api";
import { ROUTES } from "../../../routes/routeConfig";
import Loading from "../ui/Loading/Loading";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.getUserProfile();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loading>Loading...</Loading>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={ROUTES.USER_LOGIN} replace />
  );
};

export default PrivateRoute;
