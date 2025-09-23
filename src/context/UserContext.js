import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]); // ✅ posts state
  const backendURL = process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com"; // ✅ backend URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        if (data.success) setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        updateProfile,
        posts,      // ✅ expose posts
        setPosts,   // ✅ expose setPosts
        backendURL, // ✅ expose backend URL
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

