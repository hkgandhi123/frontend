import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, login, signup, logout } from "../api";
import { resolveURLWithCacheBust } from "../utils/resolveURL";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPostGlobal, setNewPostGlobal] = useState(null);

  /* 🧩 Helper: Return valid profile image URL or default */
  const getProfilePic = (url) => {
    if (!url) return "/default-avatar.png";
    if (url.startsWith("blob:")) return url; // local preview
    return resolveURLWithCacheBust(url);
  };

  /* 🔄 Fetch current user profile */
  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getMyProfile();
      setUser({
        ...data,
        profilePic: getProfilePic(data.profilePic),
      });
      console.log("✅ User fetched:", data.username);
    } catch (err) {
      console.error("❌ Fetch user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ✏️ Update user context after profile change */
  const updateUserContext = (updatedUser) => {
    const cleanUrl = updatedUser.profilePic?.replace(/(\?|&)t=\d+/g, "") || "";
    const newUser = {
      ...updatedUser,
      profilePic: getProfilePic(cleanUrl), // refresh image with timestamp
    };
    console.log("🧠 Context updated →", newUser.username);
    setUser((prev) => ({
      ...prev,
      ...newUser,
    }));
  };

  /* 🔁 Refresh user from backend */
  const refreshUser = async () => {
    await fetchUser();
  };

  /* 🔐 Login */
  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password });
      setUser({
        ...data.user,
        profilePic: getProfilePic(data.user.profilePic),
      });
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed ❌",
      };
    }
  };

  /* 🆕 Signup */
  const handleSignup = async ({ username, email, password }) => {
    try {
      const data = await signup({ username, email, password });
      setUser({
        ...data.user,
        profilePic: getProfilePic(data.user.profilePic),
      });
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed ❌",
      };
    }
  };

  /* 🚪 Logout */
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setNewPostGlobal(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* 🆙 Add new post globally */
  const addNewPost = (newPost, type = "post") => {
    const normalized = {
      ...newPost,
      type,
      image: newPost.image.startsWith("http")
        ? resolveURLWithCacheBust(newPost.image)
        : newPost.image,
      user: {
        ...newPost.user,
        profilePic: getProfilePic(newPost.user?.profilePic),
      },
    };

    setUser((prev) => ({
      ...prev,
      posts:
        type === "post" ? [normalized, ...(prev?.posts || [])] : prev?.posts,
      reels:
        type === "reel" ? [normalized, ...(prev?.reels || [])] : prev?.reels,
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
        refreshUser,
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
