import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useUserContext } from "../context/UserContext";
import {
  getPosts,
  getStories,
  resolveURLWithCacheBust,
  deletePost,
} from "../api";

import BottomNav from "../components/BottomNav";
import CreatePostModal from "../components/CreatePostModal";
import CreateStoryModal from "../components/CreateStoryModal";
import StoryViewerModal from "../components/StoryViewerModal";
import HomeHeader from "../components/HomeHeader";
import PostCard from "../components/PostCard";

const Home = () => {
  const { user: currentUser, setNewPostGlobal } = useUserContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  // 🔹 Header hide states
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollRef = useRef(0);
  const scrollContainerRef = useRef(null);

  // 🔹 Scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScroll = scrollContainer.scrollTop;

      if (currentScroll > lastScrollRef.current + 20) setHideHeader(true);
      else if (currentScroll < lastScrollRef.current - 20) setHideHeader(false);

      lastScrollRef.current = currentScroll;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const resolveProfilePic = (pic) =>
    pic && pic !== "null"
      ? resolveURLWithCacheBust(pic)
      : "https://via.placeholder.com/50";

  const normalizePosts = (data = []) =>
    data
      .filter(Boolean)
      .map((p) => {
        const user = p?.user ?? {};
        const safeUser = {
          _id: user._id || "unknown",
          username: user.username || "Unknown User",
          profilePic:
            user._id === currentUser?._id
              ? currentUser?.profilePic || "https://via.placeholder.com/50"
              : user.profilePic
              ? resolveProfilePic(user.profilePic)
              : "https://via.placeholder.com/50",
        };

        const mediaUrl = p.mediaUrl || p.image || null;
        const mediaType =
          p.mediaType ||
          (mediaUrl?.match(/\.(mp4|webm|mkv)$/i) ? "video" : "image");

        return {
          ...p,
          title: p.title || "Untitled",
          content: p.content || p.article || "",
          media: mediaUrl ? resolveURLWithCacheBust(mediaUrl) : null,
          mediaType,
          user: safeUser,
        };
      });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(normalizePosts(data));
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchStories = useCallback(async () => {
    try {
      const data = await getStories();
      setStories(
        (data || []).map((s) => ({
          ...s,
          user: s?.user
            ? {
                ...s.user,
                username: s.user.username || "Unknown",
                profilePic:
                  s.user._id === currentUser?._id
                    ? currentUser.profilePic
                    : resolveProfilePic(s.user.profilePic),
              }
            : {
                _id: "unknown",
                username: "Unknown",
                profilePic: "https://via.placeholder.com/50",
              },
          image: s.image ? resolveURLWithCacheBust(s.image) : null,
        }))
      );
    } catch (err) {
      console.error("❌ Error fetching stories:", err);
      setStories([]);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, [fetchPosts, fetchStories]);

  // 🔹 Delete Post Handler
  const handleDeletePost = async (id) => {
    const postExists = posts.find((p) => p._id === id);
    if (!postExists) return console.warn("Post already deleted or invalid ID:", id);

    try {
      console.log("🚨 Deleting Post ID:", id);
      const result = await deletePost(id);
      console.log("✅ Delete API Result:", result);

      setPosts((prev) => prev.filter((p) => p._id !== id));
      setNewPostGlobal((prev) => (prev?._id === id ? null : prev));
    } catch (err) {
      console.error("❌ Error deleting post:", err.message);
      alert(err.message); // Optional: user-friendly alert
    }
  };

  // 🔹 Add new post to state
  const handleNewPost = (newPost) => {
    const normalized = normalizePosts([newPost])[0];
    if (normalized) {
      setPosts((prev) => [normalized, ...prev]);
      setNewPostGlobal(normalized);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <Helmet>
        <title>HitBit</title>
      </Helmet>

      {/* Header */}
      <div
        className={`top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          hideHeader ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <HomeHeader
          onAddPost={() => setShowPostModal(true)}
          onAddStory={() => setShowStoryModal(true)}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto h-[calc(100vh-5rem)] mt-[3rem] pb-20 px-2 sm:px-0 relative z-10"
      >
        {/* Stories */}
        <div className="border-b border-white/10 backdrop-blur-md bg-blue-900">
          <div className="flex space-x-3 p-2 overflow-x-auto">
            {/* Add Story */}
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setShowStoryModal(true)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/40">
                <span className="text-2xl font-bold">+</span>
              </div>
              <span className="text-xs mt-1 text-gray-100">Add Story</span>
            </div>

            {stories
              .filter((s) => s?.user?._id && s.user._id !== currentUser?._id)
              .map((story) => (
                <div key={story._id} className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full cursor-pointer"
                    onClick={() => setSelectedStory(story)}
                  >
                    <img
                      src={story.user?.profilePic}
                      alt={story.user?.username}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <span
                    className="text-xs mt-1 cursor-pointer text-gray-100"
                    onClick={() => navigate(`/profile/${story.user._id}`)}
                  >
                    {story.user?.username}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Posts */}
        <div className="mt-0">
          {loading ? (
            <p className="text-center mt-10 text-gray-100">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center mt-10 text-gray-100">No posts yet</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="w-full">
                <PostCard post={post} onDelete={handleDeletePost} onFollowToggle={() => {}} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showPostModal && (
        <CreatePostModal
          onClose={() => setShowPostModal(false)}
          onPostCreated={handleNewPost}
        />
      )}
      {showStoryModal && (
        <CreateStoryModal
          onClose={() => setShowStoryModal(false)}
          onStoryCreated={fetchStories}
        />
      )}
      {selectedStory && (
        <StoryViewerModal story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;
