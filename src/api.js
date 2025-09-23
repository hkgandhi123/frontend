// src/services/api.js
import axios from "axios";

// 🔹 Axios instance with base URL & credentials
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com",
  withCredentials: true, // ✅ Cookies automatically sent
});

// ========== AUTH ==========

// 🔹 Signup
export const signup = async (formData) => {
  try {
    const res = await API.post("/auth/signup", formData);
    return res.data;
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Login
export const login = async (formData) => {
  try {
    const res = await API.post("/auth/login", formData);
    return res.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Get logged-in user profile
export const getProfile = async () => {
  try {
    const res = await API.get("/auth/profile");
    return res.data;
  } catch (err) {
    console.error("Get profile error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 Update profile (username, bio, profilePic)
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    if (profileData.username) formData.append("username", profileData.username);
    if (profileData.bio) formData.append("bio", profileData.bio);
    if (profileData.profilePic) formData.append("profilePic", profileData.profilePic);

    const res = await API.put("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Update profile error:", err.response?.data || err.message);
    throw err;
  }
};
