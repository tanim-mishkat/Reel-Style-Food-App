import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { foodPartnerService } from "../../services/api";
import { ROUTES } from "../../../routes/routeConfig";
import Loading from "../ui/Loading/Loading";

const PartnerPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await foodPartnerService.getMyProfile();
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
    <Navigate to={ROUTES.FOOD_PARTNER_LOGIN} replace />
  );
};

export default PartnerPrivateRoute;
