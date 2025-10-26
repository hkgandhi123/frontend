import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, login, signup, logout, resolveURL } from "../api";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPostGlobal, setNewPostGlobal] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getMyProfile();
      if (data.profilePic)
        data.profilePic = resolveURL(data.profilePic) + `?t=${Date.now()}`;
      setUser(data.user || data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Update global user state (profilePic included)
  const updateUserContext = (updatedUser) => {
    setUser({
      ...updatedUser,
      profilePic: updatedUser.profilePic
        ? resolveURL(updatedUser.profilePic) + `?t=${Date.now()}`
        : "/default-avatar.png",
    });
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password });
      if (data.user?.profilePic)
        data.user.profilePic = resolveURL(data.user.profilePic) + `?t=${Date.now()}`;
      setUser(data.user || data);
      return { success: true, user: data.user || data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed ❌" };
    }
  };

  const handleSignup = async ({ username, email, password }) => {
    try {
      const data = await signup({ username, email, password });
      if (data.user?.profilePic)
        data.user.profilePic = resolveURL(data.user.profilePic) + `?t=${Date.now()}`;
      setUser(data.user || data);
      return { success: true, user: data.user || data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Signup failed ❌" };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setNewPostGlobal(null);
    } catch (err) {
      console.error("Logout failed", err.response?.data);
    }
  };

  const addNewPost = (newPost, type = "post") => {
    const normalized = {
      ...newPost,
      type,
      image: newPost.image.startsWith("http") ? newPost.image : resolveURL(newPost.image),
      user: {
        ...newPost.user,
        profilePic: newPost.user?.profilePic
          ? resolveURL(newPost.user.profilePic) + `?t=${Date.now()}`
          : "/default-avatar.png",
      },
    };

    setUser((prev) => ({
      ...prev,
      posts: type === "post" ? [normalized, ...(prev.posts || [])] : prev.posts,
      reels: type === "reel" ? [normalized, ...(prev.reels || [])] : prev.reels,
    }));

    setNewPostGlobal(normalized);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUserContext,
        loading,
        isAuthenticated: !!user?._id,
        fetchUser,
        handleLogin,
        handleSignup,
        handleLogout,
        addNewPost,
        newPostGlobal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
