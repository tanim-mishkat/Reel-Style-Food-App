import React, { useContext, useReducer } from "react";
import { CartContext } from "./cartContextValue";

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }

    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);

    case "UPDATE_QTY":
      if (action.payload.qty <= 0) {
        return state.filter((item) => item.id !== action.payload.id);
      }
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, qty: action.payload.qty }
          : item
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQty = (id, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clear = () => dispatch({ type: "CLEAR" });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

// `useCart` moved to a dedicated hook at `src/shared/hooks/useCart.js`
