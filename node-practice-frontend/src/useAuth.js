// This page is for testing client-side authentication

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
  const [loading, setLoading] = useState(isAuthenticated && false); // Added loading state

  useEffect(() => {

    // Check local storage first to reduce delay
    if (isAuthenticated === true) {
      setIsAuthenticated(true);
      setLoading(false);
    }
    else {

      const checkAuthStatus = async () => {
        try {
          setLoading(true); // Start loading before the request
          const response = await axios.get(process.env.REACT_APP_USERSTATUS_URI, { withCredentials: true });
          setIsAuthenticated(response.data.isAuthenticated);

          sessionStorage.setItem('isAuthenticated', response.data.isAuthenticated.toString());
        } catch (error) {
          console.error('Error checking authentication status:', error);
          setIsAuthenticated(false);

          sessionStorage.setItem('isAuthenticated', 'false');
        } finally {
          setLoading(false); // End loading after the request or on error
        }
      };

      checkAuthStatus();
    }
    
  }, [isAuthenticated]);

  return { isAuthenticated, loading };
};