import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Creating the context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(sessionStorage.getItem('isAuthenticated') === 'true');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!process.env.REACT_APP_USERSTATUS_URI) {
          throw new Error('REACT_APP_USERSTATUS_URI is not defined');
        }
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
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
