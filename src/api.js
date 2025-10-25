import axios from "axios";

// 🌐 Backend base URL (no /api at the end)
export const backendURL =
  process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com";

// Axios instance
const api = axios.create({
  baseURL: `${backendURL}`, // ✅ fixed: added missing quote and /api
  withCredentials: true,
});

/* ------------------ AUTH ------------------ */
export const signup = async (data) => {
  const res = await api.post("/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/logout");
  return res.data;
};

export const getMyProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data.user || res.data || {};
};

export const updateProfile = async (formData) => {
  const res = await api.put("/auth/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ------------------ PROFILES ------------------ */
export const getProfile = async (id) => {
  const res = await api.get(`/profile/${id}`);
  return res.data.user || res.data || {};
};

export const followUser = async (id) => {
  const res = await api.post(`/profile/${id}/follow`);
  return res.data;
};

export const unfollowUser = async (id) => {
  const res = await api.post(`/profile/${id}/unfollow`);
  return res.data;
};

/* ------------------ POSTS ------------------ */
export const getPosts = async () => {
  try {
    const res = await api.get("/posts");
    return Array.isArray(res.data) ? res.data : res.data?.posts || [];
  } catch (err) {
    console.error("❌ getPosts error:", err);
    return [];
  }
};

export const createPost = async (formData) => {
  try {
    const res = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ createPost error:", err.response?.data || err.message);
    throw err;
  }
};

export const updatePost = async (id, formData) => {
  try {
    const res = await api.put(`/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ updatePost error:", err.response?.data || err.message);
    throw err;
  }
};

export const deletePost = async (id) => {
  try {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ deletePost error:", err.response?.data || err.message);
    throw err;
  }
};

/* ------------------ STORIES ------------------ */
export const getStories = async () => {
  const res = await api.get("/stories");
  return Array.isArray(res.data) ? res.data : res.data?.stories || [];
};

export const createStory = async (formData) => {
  const res = await api.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ------------------ USERS ------------------ */
export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?q=${query}`);
  return res.data || [];
};

/* ------------------ HELPERS ------------------ */
export const resolveURL = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${backendURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};
