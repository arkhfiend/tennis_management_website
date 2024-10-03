import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    // Retrieve the initial state from localStorage
    const savedAuthState = localStorage.getItem('authenticated');
    return savedAuthState ? JSON.parse(savedAuthState) : false;
  });

  useEffect(() => {
    // Save the authenticated state to localStorage whenever it changes
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;