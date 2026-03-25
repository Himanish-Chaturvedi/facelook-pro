import React, { createContext, useState, useContext, useEffect } from 'react';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('facelook_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('facelook_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? {...item, quantity: item.quantity + 1} : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id, amt) => {
    setCart(prev => prev.map(item => item.id === id ? {...item, quantity: Math.max(1, item.quantity + amt)} : item));
  };
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};