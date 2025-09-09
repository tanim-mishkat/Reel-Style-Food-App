import { createContext } from 'react';

// Export the context from a separate file so files that export components only
// don't also export non-component values (fixes react-refresh lint rule).
export const CartContext = createContext();

export default CartContext;
