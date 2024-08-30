"use client"
import { createContext, useContext, useState, useEffect} from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState({});

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
        setCurrUser(JSON.parse(storedUser));
        }
    }, []);  

  return (
    <UserContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
