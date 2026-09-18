import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('manmeet_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session expired or invalid token:', err.message);
        localStorage.removeItem('manmeet_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        localStorage.setItem('manmeet_token', data.token);
        setUser(data.user);
        addToast(`Welcome back, ${data.user.name.split(' ')[0]}! ✨`, 'success');
        return data.user;
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (data.success) {
        localStorage.setItem('manmeet_token', data.token);
        setUser(data.user);
        addToast(`Welcome to Manmeet Creations, ${data.user.name}! ✨`, 'success');
        return data.user;
      }
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('manmeet_token');
    setUser(null);
    addToast('You have been logged out. See you again soon! ✨', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (data.success) {
        if (data.token) {
          localStorage.setItem('manmeet_token', data.token);
        }
        setUser(data.user);
        addToast('Your profile has been updated! ✨', 'success');
        return data.user;
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
      throw err;
    }
  };

  const addAddress = async (address) => {
    try {
      const data = await apiRequest('/auth/address', {
        method: 'POST',
        body: JSON.stringify(address),
      });

      if (data.success) {
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
        addToast('New delivery address saved!', 'success');
        return data.addresses;
      }
    } catch (err) {
      addToast(err.message || 'Failed to save address.', 'error');
      throw err;
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
