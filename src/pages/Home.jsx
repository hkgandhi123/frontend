// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useUserContext } from "../context/UserContext";
import { getPosts, deletePost, getStories, resolveURL } from "../api";
import BottomNav from "../components/BottomNav";
import CreatePostModal from "../components/CreatePostModal";
import CreateStoryModal from "../components/CreateStoryModal";
import StoryViewerModal from "../components/StoryViewerModal";
import HomeHeader from "../components/HomeHeader";

import { AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsChat, BsThreeDots } from "react-icons/bs";
import { FiSend } from "react-icons/fi";

const Home = () => {
  const { posts, setPosts, user } = useUserContext();
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  // 🔹 Resolve profile pics (fallback)
  const resolveProfilePic = (url) => resolveURL(url);

  // 🔹 Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const data = await getPosts();
      const updatedPosts = data.map((p) => ({
        ...p,
        user: {
          ...p.user,
          profilePic: resolveProfilePic(p.user?.profilePic),
        },
        image: p.image ? resolveURL(p.image) : null,
      }));
      setPosts(updatedPosts);
    } catch (err) {
      console.error("❌ Fetch posts error:", err.response?.data || err.message);
    } finally {
      setLoadingPosts(false);
    }
  }, [setPosts]);

  // 🔹 Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("✅ Post deleted successfully");
    } catch (err) {
      console.error("❌ Delete post error:", err.response?.data || err.message);
      alert("❌ Failed to delete post");
    }
  };

  // 🔹 Fetch stories
  const fetchAllStories = useCallback(async () => {
    try {
      const storiesData = await getStories();
      const updatedStories = storiesData.map((s) => ({
        ...s,
        user: {
          ...s.user,
          profilePic: resolveProfilePic(s.user?.profilePic),
        },
      }));
      setStories(updatedStories);
    } catch (err) {
      console.error("❌ Fetch stories error:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchAllStories();
  }, [fetchPosts, fetchAllStories]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HomeHeader setModalOpen={setModalOpen} setStoryModalOpen={setStoryModalOpen} />

      {/* Stories */}
      <div className="mt-14 py-2 border-b bg-white">
        <div className="flex space-x-4 overflow-x-auto px-2 scrollbar-hide">
          {/* Your Story */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setStoryModalOpen(true)}
          >
            <div className="w-16 h-16 p-[2px] bg-gray-300 rounded-full relative">
              <img
                src={resolveProfilePic(user?.profilePic)}
                alt="Your Story"
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white text-white font-bold text-sm">
                +
              </div>
            </div>
            <span className="text-xs mt-1">Your Story</span>
          </div>

          {stories.map((story) => (
            <div
              key={story._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setCurrentStory(story)}
            >
              <div className="w-16 h-16 p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full">
                <img
                  src={resolveProfilePic(story.user?.profilePic)}
                  alt={`${story.user?.username || "User"} story`}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-xs mt-1">{story.user?.username || "User"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {currentStory && <StoryViewerModal story={currentStory} onClose={() => setCurrentStory(null)} />}

      {/* Posts Feed */}
      <div className="pt-2 max-w-2xl mx-auto flex flex-col space-y-8 pb-16">
        {loadingPosts ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-lg shadow-sm flex flex-col">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={resolveProfilePic(post.user?.profilePic)}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm">{post.user?.username || "User"}</span>
                </div>

                {post.user?._id?.toString() === user?._id?.toString() ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === post._id ? null : post._id)}
                      className="text-xl hover:opacity-70"
                    >
                      <BsThreeDots />
                    </button>
                    {showMenu === post._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                        <button
                          onClick={() => {
                            handleDeletePost(post._id);
                            setShowMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <BsThreeDots className="text-xl hover:opacity-70" />
                )}
              </div>

              {/* Post Image */}
              {post.image && (
                <img src={post.image} alt="Post" className="w-full object-cover" />
              )}

              {/* Post Actions */}
              <div className="flex justify-between items-center px-3 py-2">
                <div className="flex space-x-4 text-2xl">
                  <AiOutlineHeart className="hover:opacity-70" />
                  <BsChat className="hover:opacity-70" />
                  <FiSend
                    className="hover:opacity-70"
                    onClick={() => window.alert("Messages coming soon")}
                  />
                </div>
                <BsBookmark className="text-2xl hover:opacity-70" />
              </div>

              {/* Post Caption */}
              <div className="px-3 pb-3">
                <p className="font-semibold">{post.likes?.length || 0} likes</p>
                <p>
                  <span className="font-semibold">{post.user?.username}</span> {post.caption}
                </p>
                <button className="text-gray-500 text-sm">View all comments</button>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full border-none focus:ring-0 text-sm"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden">
        <BottomNav />
      </div>

      {/* Modals */}
      {modalOpen && (
  <CreatePostModal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    onPostCreated={fetchPosts}
  />
)}

{storyModalOpen && (
  <CreateStoryModal
    isOpen={storyModalOpen}
    onClose={() => setStoryModalOpen(false)}
    onStoryCreated={fetchAllStories}
  />
)}

    </div>
  );
};

export default Home;
