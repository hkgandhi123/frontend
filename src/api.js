// src/api.js
import axios from "axios";

export const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// 🔹 Axios instance
const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

/* ------------------ Helpers ------------------ */
export const resolveURL = (path) => {
  if (!path) return "/default-avatar.png";
  return path.startsWith("http") ? path : `${backendURL}${path}`;
};

/* ------------------ AUTH ------------------ */

// Signup
export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

// Login
export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// Get current user profile
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const formData = new FormData();
  if (profileData.username) formData.append("username", profileData.username);
  if (profileData.bio) formData.append("bio", profileData.bio);
  if (profileData.profilePic) formData.append("profilePic", profileData.profilePic);

  const res = await api.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

/* ------------------ POSTS ------------------ */

// Get all posts
export const getPosts = async () => {
  try {
    const res = await api.get("/posts", { headers: { "Cache-Control": "no-store" } });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching posts:", err.response?.data || err.message);
    return [];
  }
};

// Create post (with optional image)
export const createPost = async (data) => {
  try {
    const formData = new FormData();
    if (data.caption) formData.append("caption", data.caption);
    if (data.image) formData.append("image", data.image); // file object

    const res = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating post:", err.response?.data || err.message);
    throw err;
  }
};

// Delete post
export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

/* ------------------ STORIES ------------------ */

// Get all stories
export const getStories = async () => {
  try {
    const res = await api.get("/stories");
    return res.data.stories || [];
  } catch (err) {
    console.error("❌ Error fetching stories:", err.response?.data || err.message);
    return [];
  }
};

// Create story (with optional image)
export const createStory = async (data) => {
  try {
    const formData = new FormData();
    if (data.caption) formData.append("caption", data.caption);
    if (data.image) formData.append("image", data.image); // file object

    const res = await api.post("/stories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating story:", err.response?.data || err.message);
    throw err;
  }
};
