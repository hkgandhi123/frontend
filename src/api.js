import axios from "axios";

/* ------------------ BASE CONFIG ------------------ */
export const backendURL =
  process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com";

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

/* ------------------ HELPERS ------------------ */

export const resolveURL = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${backendURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

export const resolveURLWithCacheBust = (url) => {
  if (!url) return "";
  const resolved = resolveURL(url);
  return `${resolved}?t=${Date.now()}`;
};

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

/* ✅ GOOGLE LOGIN */
export const googleLogin = async (token) => {
  const res = await api.post("/google", { token });
  return res.data;
};

/* ------------------ PROFILE ------------------ */

/* ✅ Correct route: /profile */
export const getMyProfile = async () => {
  const res = await api.get("/profile");
  const user = res.data.user || res.data || {};

  if (user.profilePic) user.profilePic = resolveURL(user.profilePic);

  return user;
};

/* ✅ Correct route: /update-profile */
export const updateProfile = async (formData) => {
  const res = await api.put("/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const updatedUser = res.data.user || res.data;
  if (updatedUser.profilePic)
    updatedUser.profilePic = resolveURL(updatedUser.profilePic);

  return updatedUser;
};

/* ------------------ PUBLIC PROFILES ------------------ */

export const getProfile = async (id) => {
  const res = await api.get(`/profile/${id}`);
  const user = res.data.user || res.data || {};

  if (user.profilePic) user.profilePic = resolveURL(user.profilePic);

  if (typeof user.isFollowing === "undefined" && res.data?.isFollowing !== undefined) {
    user.isFollowing = res.data.isFollowing;
  }

  return user;
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
  const res = await api.get("/posts");
  const posts = Array.isArray(res.data) ? res.data : res.data?.posts || [];

  return posts.map((post) => ({
    ...post,
    image: post.image ? resolveURL(post.image) : null,
    user: post.user
      ? {
          ...post.user,
          profilePic: post.user.profilePic
            ? resolveURL(post.user.profilePic)
            : "/default-avatar.png",
        }
      : {},
  }));
};

export const createPost = async (postData) => {
  const formData = new FormData();
  if (postData.caption) formData.append("caption", postData.caption);
  if (postData.image) formData.append("image", postData.image);

  const res = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const post = res.data.post || res.data;

  if (post.image) post.image = resolveURL(post.image);
  if (post.user?.profilePic)
    post.user.profilePic = resolveURL(post.user.profilePic);

  return post;
};

export const updatePost = async (id, formData) => {
  const res = await api.put(`/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const post = res.data;

  if (post.image) post.image = resolveURL(post.image);
  if (post.user?.profilePic)
    post.user.profilePic = resolveURL(post.user.profilePic);

  return post;
};

export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

/* ------------------ STORIES ------------------ */

export const getStories = async () => {
  const res = await api.get("/stories");
  const stories = Array.isArray(res.data)
    ? res.data
    : res.data?.stories || [];

  return stories.map((story) => ({
    ...story,
    image: story.image ? resolveURL(story.image) : null,
    user: story.user
      ? {
          ...story.user,
          profilePic: story.user.profilePic
            ? resolveURL(story.user.profilePic)
            : "/default-avatar.png",
        }
      : {},
  }));
};

export const createStory = async (formData) => {
  const res = await api.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const story = res.data;

  if (story.image) story.image = resolveURL(story.image);
  if (story.user?.profilePic)
    story.user.profilePic = resolveURL(story.user.profilePic);

  return story;
};

/* ------------------ USERS ------------------ */

export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
  const users = res.data || [];

  return users.map((u) => ({
    ...u,
    profilePic: u.profilePic ? resolveURL(u.profilePic) : "/default-avatar.png",
  }));
};

/* ------------------ FOLLOWERS LIST ------------------ */

export const getFollowersList = async (userId) => {
  const res = await api.get(`/profile/${userId}/followers`);
  const users = res.data?.followers || res.data || [];

  return users.map((u) => ({
    ...u,
    profilePic: u.profilePic ? resolveURL(u.profilePic) : "/default-avatar.png",
  }));
};

export const getFollowingList = async (userId) => {
  const res = await api.get(`/profile/${userId}/following`);
  const users = res.data?.following || res.data || [];

  return users.map((u) => ({
    ...u,
    profilePic: u.profilePic ? resolveURL(u.profilePic) : "/default-avatar.png",
  }));
};
