import React, { useEffect } from "react";
import AppRouter from "../routes/AppRouter";
import { CartProvider } from "../shared/contexts/CartContext";
import { initPushNotifications } from "../shared/services/push";
import Toast from "../shared/components/ui/Toast/Toast";
import "../assets/styles/global.css";

const App = () => {
  useEffect(() => {
    initPushNotifications().catch(console.error);
    // Initialize CSRF token by making a request to the API
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    fetch(`${apiUrl}/health`, {
      credentials: "include",
    }).catch(() => {});
  }, []);

  return (
    <CartProvider>
      <AppRouter />
      <Toast />
    </CartProvider>
  );
};

export default App;
