import React, { useEffect, useState, useCallback } from "react";
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

  const resolveProfilePic = (pic) =>
    pic && pic !== "null"
      ? resolveURLWithCacheBust(pic)
      : "https://via.placeholder.com/50";

  const normalizePosts = (data = []) =>
    data
      .filter((p) => !!p)
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

        const mediaUrl = p.media || p.image || null;
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

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setNewPostGlobal((prev) => (prev?._id === id ? null : prev));
    } catch (err) {
      console.error("❌ Error deleting post:", err);
    }
  };

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
        <title>HitBit - Feed</title>
      </Helmet>

      {/* 🔹 Blurred Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#b56576] via-[#c27c88] to-[#e8b4b8] blur-2xl scale-110"></div>

      {/* 🔹 Foreground Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <HomeHeader
            onAddPost={() => setShowPostModal(true)}
            onAddStory={() => setShowStoryModal(true)}
          />
        </div>

        {/* Stories */}
        <div className="fixed top-12 sm:top-14 left-0 right-0 z-40 border-b border-white/10 transpirant-0 backdrop-blur-md">
          <div className="flex space-x-4 p-3 overflow-x-auto">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setShowStoryModal(true)}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/30 border border-white/40">
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

        {/* 🔹 Scrollable Posts */}
        <div className="overflow-y-auto h-[calc(100vh-11rem)] mt-[9rem] pb-20 px-2 sm:px-0">
          <div className="max-w-3xl mx-auto flex flex-col space-y-6">
            {loading ? (
              <p className="text-center mt-10 text-gray-100">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center mt-10 text-gray-100">No posts yet</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="rounded-2xl shadow-lg bg-gradient-to-br from-[#c46f7f] via-[#d28795] to-[#e8b4b8] text-white p-4 backdrop-blur-lg transition-transform hover:scale-[1.01]"
                >
                  <PostCard
                    post={post}
                    onDelete={handleDeletePost}
                    onFollowToggle={() => {}}
                  />
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
          <StoryViewerModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Home;
