// src/context/UserContext.jsx
// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPosts, getStories, getProfile, login, signup, resolveURL } from "../api";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com";

  // ====================== FETCH POSTS ======================
  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts();
      const updatedPosts = data.map((p) => ({
        ...p,
        image: resolveURL(p.image),
        user: {
          ...p.user,
          profilePic: resolveURL(p.user?.profilePic),
        },
      }));
      setPosts(updatedPosts);
    } catch (err) {
      console.error("❌ Fetch posts error:", err.response?.data || err.message);
    }
  }, []);

  // ====================== FETCH STORIES ======================
  const fetchAllStories = useCallback(async () => {
    try {
      const data = await getStories();
      const updatedStories = data.map((s) => ({
        ...s,
        media: resolveURL(s.image),
        user: {
          ...s.user,
          profilePic: resolveURL(s.user?.profilePic),
        },
      }));
      setStories(updatedStories);
    } catch (err) {
      console.error("❌ Fetch stories error:", err.message);
    }
  }, []);

  // ====================== FETCH PROFILE ======================
  const fetchProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser({
        ...profile,
        profilePic: resolveURL(profile?.profilePic),
      });
    } catch (err) {
      console.error("❌ Fetch profile error:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================== AUTH ======================
  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials);
      setUser({ ...data.user, profilePic: resolveURL(data.user?.profilePic) });
      return { success: true };
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const handleSignup = async (userData) => {
    try {
      const data = await signup(userData);
      setUser({ ...data.user, profilePic: resolveURL(data.user?.profilePic) });
      return { success: true };
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // ====================== INITIAL LOAD ======================
  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchAllStories();
  }, [fetchProfile, fetchPosts, fetchAllStories]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        posts,
        setPosts,
        stories,
        setStories,
        loading,
        backendURL,
        fetchPosts,
        fetchAllStories,
        handleLogin,
        handleSignup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
