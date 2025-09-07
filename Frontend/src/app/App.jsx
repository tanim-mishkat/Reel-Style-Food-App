import React from "react";
import AppRouter from "../routes/AppRouter";
import { CartProvider } from "../shared/contexts/CartContext";
import "../assets/styles/global.css";

const App = () => {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
};

export default App;