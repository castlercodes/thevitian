"use client"

import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(JSON.parse(sessionStorage.getItem('user')) || {});

  return (
    <UserContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
