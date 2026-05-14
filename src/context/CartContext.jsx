import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const isInitialMount = useRef(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      } catch (err) {
        console.error('Failed to parse cart:', err);
      }
    }
  }, []);

  // Save cart to localStorage, skipping first render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const createCartItem = (product, quantity = 1) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrls: product.imageUrls || [],
    quantity,
    size: product.size || null,
    color: product.color || null,
    bust: product.bust || null,
    length: product.length || null,
    waist: product.waist || null,
    dressCode: product.dressCode || null,
  });

  const addToCart = (product, quantity = 1) => {
    const cartItem = createCartItem(product, quantity);
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex !== -1) {
        console.log('⚠️ Product already in cart, not adding again');
        return prev;
      }
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};