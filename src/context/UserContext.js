import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, login, signup, logout } from "../api";
import { resolveURLWithCacheBust } from "../utils/resolveURL";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPostGlobal, setNewPostGlobal] = useState(null);

  const getProfilePic = (url) => {
    if (!url) return "/default-avatar.png";
    if (url.startsWith("blob:")) return url;
    return resolveURLWithCacheBust(url);
  };

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

  const updateUserContext = (updatedUser) => {
    const cleanUrl = updatedUser.profilePic?.replace(/(\?|&)t=\d+/g, "") || "";
    const newUser = {
      ...updatedUser,
      profilePic: getProfilePic(cleanUrl),
    };
    setUser((prev) => ({
      ...prev,
      ...newUser,
    }));
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  /* 🔐 Normal Login (FIXED for phone/email login) */
const handleLogin = async ({ emailOrPhone, password }) => {
  try {
    const data = await login({ emailOrPhone, password });

    // Save token to localStorage for API calls like deletePost
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

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

  /* ✅ ✅ ✅ GOOGLE LOGIN (NEW) */
 const handleGoogleLogin = async (credential) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: "POST",
      credentials: "include", // ✅ important
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credential }),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: "Google Login Failed ❌" };

    setUser({
      ...data.user,
      profilePic: getProfilePic(data.user.profilePic),
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Google Login Error ❌" };
  }
};


  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setNewPostGlobal(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
        handleGoogleLogin, // ✅ NEW EXPORT
        handleLogout,
        addNewPost,
        newPostGlobal,
         
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
