import axios from "axios";

// 🔹 Base URL setup
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://bkc-dt1n.onrender.com",
  withCredentials: true, // ✅ Cookie automatically send hogi
});

// ========== AUTH ==========

// 🔹 Signup
export const signup = async (formData) => {
  const { data } = await API.post("/auth/signup", formData);
  return data;
};

// 🔹 Login
export const login = async (formData) => {
  const { data } = await API.post("/auth/login", formData);
  return data;
};

// 🔹 Logout
export const logout = async () => {
  const { data } = await API.post("/auth/logout");
  return data;
};

// 🔹 Get logged-in user profile
export const getProfile = async () => {
  const { data } = await API.get("/auth/profile");
  return data;
};

// 🔹 Update profile (with image upload)
export const updateProfile = async (profileData) => {
  const formData = new FormData();

  if (profileData.username) formData.append("username", profileData.username);
  if (profileData.bio) formData.append("bio", profileData.bio);
  if (profileData.profilePic) formData.append("profilePic", profileData.profilePic);

  const { data } = await API.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

// 🔹 Check authentication status
export const isAuthenticated = async () => {
  try {
    await getProfile();
    return true;
  } catch {
    return false;
  }
};

// ========== POSTS ==========

// 🔹 Get all posts
export const getPosts = async () => {
  const { data } = await API.get("/posts");
  return data;
};

// 🔹 Get my posts
export const getMyPosts = async () => {
  const { data } = await API.get("/posts/my-posts");
  return data;
};

// 🔹 Create a new post (image/video upload supported)
export const createPost = async (postData) => {
  const formData = new FormData();
  if (postData.caption) formData.append("caption", postData.caption);
  if (postData.file) formData.append("file", postData.file);

  const { data } = await API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};
