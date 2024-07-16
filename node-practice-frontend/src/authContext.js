import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Creating the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_USERSTATUS_URI, { withCredentials: true });
        const isAuthenticated = response.data.isAuthenticated;
        setIsAuthenticated(isAuthenticated);
        sessionStorage.setItem('isAuthenticated', isAuthenticated.toString());
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        sessionStorage.setItem('isAuthenticated', 'false');
      } finally {
        setLoading(false);
      }
    };

    if (sessionStorage.getItem('isAuthenticated') === null) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
