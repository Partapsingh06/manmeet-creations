import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('manmeet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('manmeet_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, customNote = '') => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product === (product._id || product.id));

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (customNote) {
          updated[existingIndex].customNote = customNote;
        }
        return updated;
      } else {
        return [
          ...prev,
          {
            product: product._id || product.id,
            slug: product.slug,
            name: product.name,
            price: Number(product.price),
            originalPrice: Number(product.originalPrice || product.price),
            image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.featuredImage || product.image),
            category: product.category,
            quantity: Number(quantity),
            customNote: customNote || '',
          },
        ];
      }
    });

    addToast(`"${product.name}" added to cart! 🛍️`, 'success');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.product === productId ? { ...item, quantity: Number(quantity) } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('manmeet_cart');
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const discountTotal = Math.max(0, originalSubtotal - subtotal);
  
  // Free delivery threshold: ₹999
  const shippingThreshold = 999;
  const shippingPrice = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99;
  const amountNeededForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const totalAmount = subtotal + shippingPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemsCount,
        subtotal,
        originalSubtotal,
        discountTotal,
        shippingPrice,
        shippingThreshold,
        amountNeededForFreeShipping,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
