import axios from "axios";

// 🌐 Backend base URL
export const backendURL =
  process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com";

// Axios instance with credentials
const api = axios.create({
  baseURL: backendURL,
  withCredentials: true, // send cookies for auth
});

/* ------------------ HELPERS ------------------ */

// ✅ Resolve full URL for images/files
export const resolveURL = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${backendURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

/* ------------------ AUTH ------------------ */

// ✅ Signup
export const signup = async (data) => {
  try {
    const res = await api.post("/signup", data);
    return res.data;
  } catch (err) {
    console.error("❌ signup error:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Login
export const login = async (data) => {
  try {
    const res = await api.post("/login", data);
    return res.data;
  } catch (err) {
    console.error("❌ login error:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    const res = await api.post("/logout");
    return res.data;
  } catch (err) {
    console.error("❌ logout error:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Get logged-in user's profile
export const getMyProfile = async () => {
  try {
    const res = await api.get("/profile/me");
    const user = res.data.user || res.data || {};
    if (user.profilePic) user.profilePic = resolveURL(user.profilePic);
    return user;
  } catch (err) {
    console.error("❌ getMyProfile error:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Update logged-in user's profile
export const updateProfile = async (formData) => {
  try {
    const res = await api.put("/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updatedUser = res.data.user || res.data;
    if (updatedUser.profilePic) updatedUser.profilePic = resolveURL(updatedUser.profilePic);
    return updatedUser;
  } catch (err) {
    console.error("❌ updateProfile error:", err.response?.data || err.message);
    throw err;
  }
};

/* ------------------ PUBLIC PROFILES ------------------ */

export const getProfile = async (id) => {
  try {
    const res = await api.get(`/profile/${id}`);
    const user = res.data.user || res.data || {};
    if (user.profilePic) user.profilePic = resolveURL(user.profilePic);
    return user;
  } catch (err) {
    console.error(`❌ getProfile error for id=${id}:`, err.response?.data || err.message);
    throw err;
  }
};

export const followUser = async (id) => {
  try {
    const res = await api.post(`/profile/${id}/follow`);
    return res.data;
  } catch (err) {
    console.error(`❌ followUser error for id=${id}:`, err.response?.data || err.message);
    throw err;
  }
};

export const unfollowUser = async (id) => {
  try {
    const res = await api.post(`/profile/${id}/unfollow`);
    return res.data;
  } catch (err) {
    console.error(`❌ unfollowUser error for id=${id}:`, err.response?.data || err.message);
    throw err;
  }
};

/* ------------------ POSTS ------------------ */

export const getPosts = async () => {
  try {
    const res = await api.get("/posts");
    const posts = Array.isArray(res.data) ? res.data : res.data?.posts || [];
    return posts.map(post => ({
      ...post,
      image: post.image ? resolveURL(post.image) : null,
      user: post.user
        ? { ...post.user, profilePic: post.user.profilePic ? resolveURL(post.user.profilePic) : "/default-avatar.png" }
        : {},
    }));
  } catch (err) {
    console.error("❌ getPosts error:", err.response?.data || err.message);
    return [];
  }
};

export const createPost = async (formData) => {
  try {
    const res = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const post = res.data;
    if (post.image) post.image = resolveURL(post.image);
    if (post.user?.profilePic) post.user.profilePic = resolveURL(post.user.profilePic);
    return post;
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
    const post = res.data;
    if (post.image) post.image = resolveURL(post.image);
    if (post.user?.profilePic) post.user.profilePic = resolveURL(post.user.profilePic);
    return post;
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
  try {
    const res = await api.get("/stories");
    const stories = Array.isArray(res.data) ? res.data : res.data?.stories || [];
    return stories.map(story => ({
      ...story,
      image: story.image ? resolveURL(story.image) : null,
      user: story.user
        ? { ...story.user, profilePic: story.user.profilePic ? resolveURL(story.user.profilePic) : "/default-avatar.png" }
        : {},
    }));
  } catch (err) {
    console.error("❌ getStories error:", err.response?.data || err.message);
    return [];
  }
};

export const createStory = async (formData) => {
  try {
    const res = await api.post("/stories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const story = res.data;
    if (story.image) story.image = resolveURL(story.image);
    if (story.user?.profilePic) story.user.profilePic = resolveURL(story.user.profilePic);
    return story;
  } catch (err) {
    console.error("❌ createStory error:", err.response?.data || err.message);
    throw err;
  }
};

/* ------------------ USERS ------------------ */

export const searchUsers = async (query) => {
  try {
    const res = await api.get(`/users/search?q=${query}`);
    const users = res.data || [];
    return users.map(u => ({
      ...u,
      profilePic: u.profilePic ? resolveURL(u.profilePic) : "/default-avatar.png",
    }));
  } catch (err) {
    console.error("❌ searchUsers error:", err.response?.data || err.message);
    return [];
  }
};
