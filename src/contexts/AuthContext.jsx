import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false since we're not waiting for verify
  const navigate = useNavigate();

  useEffect(() => {
    // Add console logs to debug authentication state
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('Auth Check:', { token, storedUser });
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('User authenticated:', userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (userData, token) => {
    console.log('Login called with:', { userData, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('conversationId');
    setUser(null);
    navigate('/login');
  };

  // For development/testing - add this function
  const debugLogin = () => {
    const testUser = {
      id: 'test-id',
      fullName: 'Test User',
      email: 'test@example.com'
    };
    const testToken = 'test-token';
    login(testUser, testToken);
    console.log('Debug login executed');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, debugLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
