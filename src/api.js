// src/api.js
import axios from "axios";

export const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Axios instance
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
export const signup = async (data) => (await api.post("/auth/signup", data)).data;
export const login = async (data) => (await api.post("/auth/login", data)).data;
export const getProfile = async () => (await api.get("/auth/profile")).data;
export const logout = async () => (await api.post("/auth/logout")).data;

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

/* ------------------ POSTS ------------------ */
export const getPosts = async () => {
  try {
    const res = await api.get("/posts", { headers: { "Cache-Control": "no-store" } });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching posts:", err.response?.data || err.message);
    return [];
  }
};

// ✅ Create post with mandatory image
export const createPost = async (data) => {
  if (!data.image) throw new Error("Image is required");

  try {
    const formData = new FormData();
    formData.append("image", data.image); // must be "image"
    if (data.caption) formData.append("caption", data.caption);

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
export const deletePost = async (id) => (await api.delete(`/posts/${id}`)).data;

/* ------------------ STORIES ------------------ */
export const getStories = async () => {
  try {
    const res = await api.get("/stories");
    return res.data.stories || [];
  } catch (err) {
    console.error("❌ Error fetching stories:", err.response?.data || err.message);
    return [];
  }
};

export const createStory = async (data) => {
  if (!data.image) throw new Error("Image is required for story");

  try {
    const formData = new FormData();
    formData.append("image", data.image);
    if (data.caption) formData.append("caption", data.caption);

    const res = await api.post("/stories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating story:", err.response?.data || err.message);
    throw err;
  }
};
