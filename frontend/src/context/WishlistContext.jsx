import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { apiRequest } from '../utils/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('manmeet_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with user's wishlist when user logs in
  useEffect(() => {
    if (user && user.wishlist) {
      // If user.wishlist contains populated objects or IDs
      const mapped = user.wishlist.map((item) => (typeof item === 'object' ? item._id : item));
      setWishlistItems(mapped);
    }
  }, [user]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('manmeet_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    const id = productId?._id || productId;
    return wishlistItems.includes(id);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id || product;
    const isCurrentlySaved = isInWishlist(productId);

    if (isCurrentlySaved) {
      setWishlistItems((prev) => prev.filter((id) => id !== productId));
      addToast('Removed from Wishlist', 'info');
    } else {
      setWishlistItems((prev) => [...prev, productId]);
      addToast('Saved to your Wishlist ❤️', 'success');
    }

    // If logged in, sync with database
    if (user) {
      try {
        await apiRequest(`/auth/wishlist/${productId}`, { method: 'POST' });
      } catch (err) {
        console.error('Wishlist sync error:', err.message);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
