import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useUserContext } from "../context/UserContext";
import { getPosts, getStories, resolveURL, deletePost } from "../api";
import BottomNav from "../components/BottomNav";
import CreatePostModal from "../components/CreatePostModal";
import CreateStoryModal from "../components/CreateStoryModal";
import StoryViewerModal from "../components/StoryViewerModal";
import HomeHeader from "../components/HomeHeader";
import PostCard from "../components/PostCard";

const Home = () => {
  const { user, setNewPostGlobal } = useUserContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const normalizePosts = (data) =>
    data.map((p) => ({
      ...p,
      image: resolveURL(p.image),
      user: {
        ...p.user,
        profilePic: p.user?.profilePic ? resolveURL(p.user.profilePic) : "/default-avatar.png",
      },
    }));

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(normalizePosts(data));
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStories = useCallback(async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setStories([]);
    }
  }, []);

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
      console.error("Error deleting post:", err);
    }
  };

  const handleNewPost = (newPost) => {
    const normalized = normalizePosts([newPost])[0];
    setPosts((prev) => [normalized, ...prev]);
    setNewPostGlobal(normalized); // update global state
  };

  const resolveProfilePic = (pic) => (pic ? resolveURL(pic) : "/default-avatar.png");

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>HitBit</title>
      </Helmet>

      <HomeHeader
        onAddPost={() => setShowPostModal(true)}
        onAddStory={() => setShowStoryModal(true)}
      />

      {/* Stories */}
      <div className="flex space-x-4 p-3 overflow-x-auto border-b bg-white">
        {/* Add your own story */}
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowStoryModal(true)}
        >
          <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-gray-200">
            <span className="text-2xl">+</span>
          </div>
        </div>

        {/* Other users' stories */}
        {Array.isArray(stories) &&
          stories
            .filter((s) => s.user?._id && s.user._id !== user?._id)
            .map((story) => (
              <div key={story._id} className="flex flex-col items-center relative">
                <div
                  className="w-16 h-16 p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full cursor-pointer"
                  onClick={() => setSelectedStory(story)}
                >
                  <img
                    src={resolveProfilePic(story.user?.profilePic)}
                    alt={story.user?.username || "User"}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <span
                  className="text-xs mt-1 cursor-pointer"
                  onClick={() => navigate(`/profile/${story.user._id}`)}
                >
                  {story.user?.username || "User"}
                </span>
              </div>
            ))}
      </div>

      {/* Posts */}
      <div className="max-w-3xl mx-auto mt-4 flex flex-col space-y-6">
        {loading ? (
          <p className="text-center mt-10">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center mt-10">No posts yet</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onDelete={handleDeletePost} />)
        )}
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

      <BottomNav />
    </div>
  );
};

export default Home;
