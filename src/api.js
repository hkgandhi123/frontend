// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL 
    : window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://bkc-dt1n.onrender.com",
  withCredentials: true, // ✅ Cookie har request ke sath bhejega
});

/* ===================== AUTH APIs ===================== */

// 🔹 Signup
export const signup = async (formData) => {
  const res = await API.post("/auth/signup", formData);
  return res.data;
};

// 🔹 Login
export const login = async (formData) => {
  const res = await API.post("/auth/login", formData);
  return res.data;
};

// 🔹 Get Profile
export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};

// 🔹 Update Profile
export const updateProfile = async (userData) => {
  const res = await API.put("/auth/profile", userData);
  return res.data;
};

// 🔹 Logout
export const logout = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// 🔹 Check if logged in
export const isAuthenticated = async () => {
  try {
    await getProfile();
    return true;
  } catch {
    return false;
  }
};

/* ===================== POSTS APIs ===================== */

// 🔹 Get all posts
export const getPosts = async () => {
  const res = await API.get("/posts");
  return res.data;
};

// 🔹 Get my posts
export const getMyPosts = async () => {
  const res = await API.get("/posts/my-posts");
  return res.data;
};

// 🔹 Create a new post (with image/video)
export const createPost = async (formData) => {
  const res = await API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🔹 Delete a post
export const deletePost = async (postId) => {
  const res = await API.delete(`/posts/${postId}`);
  return res.data;
};

// 🔹 Like a post
export const likePost = async (postId) => {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data;
};

// 🔹 Comment on a post
export const commentOnPost = async (postId, text) => {
  const res = await API.post(`/posts/${postId}/comment`, { text });
  return res.data;
};
