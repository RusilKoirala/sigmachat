import React, { createContext, useState, useEffect } from 'react';

export const UsernameContext = createContext({ username: '', setUsername: () => {} });

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    try {
      const stored = localStorage.getItem('sigmachat-username');
      return stored ? JSON.parse(stored) : '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem('sigmachat-username', JSON.stringify(username));
    }
  }, [username]);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};