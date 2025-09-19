import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user once on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (err) {
        console.error("User not logged in or error fetching profile:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
