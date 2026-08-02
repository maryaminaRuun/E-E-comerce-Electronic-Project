import { createContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('voltx-cart')) || []; }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem('voltx-cart', JSON.stringify(cart)), [cart]);

  const addToCart = product => setCart(items => {
    const found = items.find(item => item.id === product.id);
    return found
      ? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { ...product, quantity: 1 }];
  });

  const updateQuantity = (id, quantity) => setCart(items =>
    items.map(item => item.id === id ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item)
  );
  const removeFromCart = id => setCart(items => items.filter(item => item.id !== id));
  const clearCart = () => setCart([]);
  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <CartContext.Provider value={{ cart, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, calculateTotal }}>{children}</CartContext.Provider>;
};

export default CartContext;
