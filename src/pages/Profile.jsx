import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { getProfile, deletePost, followUser, unfollowUser } from "../api";
import PostModal from "../components/PostModal";
import { resolveURLWithCacheBust } from "../utils/resolveURL";
import { BsThreeDotsVertical } from "react-icons/bs"; // ⬅️ Added 3-dots icon

const resolveProfilePic = (url) => {
  if (!url) return "/default-avatar.png";
  if (url.startsWith("blob:")) return "/default-avatar.png";
  const cleanUrl = url.replace(/\?(v|t)=\d+$/, "");
  return `${cleanUrl}?v=${Date.now()}`;
};

const Profile = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, newPostGlobal } = useUserContext();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [activeTab, setActiveTab] = useState("posts");

  const normalizePosts = (data) =>
    data.map((p) => ({
      ...p,
      image: p.image ? resolveURLWithCacheBust(p.image) : "/default-post.png",
      user: { ...p.user, profilePic: resolveProfilePic(p.user?.profilePic) },
      likes: p.likes || 0,
      comments: p.comments || 0,
    }));

  useEffect(() => {
    if (!paramId) return;
    if (paramId === "me" && !user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const idToFetch = paramId === "me" ? user._id : paramId;
        const data = await getProfile(idToFetch);

        if (!data || !data._id) {
          setProfile(null);
          return;
        }

        setProfile({
          ...data,
          profilePic: resolveProfilePic(data.profilePic),
        });
        setPosts(normalizePosts(data.posts || []));
        if (user && (data.followers || []).includes(user._id))
          setIsFollowing(true);
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [paramId, user, newPostGlobal]);

  useEffect(() => {
    if (!user || !profile) return;
    if (user._id === profile._id) {
      setProfile((prev) => ({
        ...prev,
        username: user.username,
        bio: user.bio,
        profilePic: resolveProfilePic(user.profilePic),
      }));
    }
  }, [user?.username, user?.bio, user?.profilePic]);

  const isOwnProfile = user && (paramId === "me" || profile?._id === user._id);

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setSelectedPost((prev) => (prev && prev._id === postId ? null : prev));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed ❌");
    }
  };

  const handleFollowToggle = async () => {
    if (!profile || !user) return;

    try {
      if (isFollowing) {
        setIsFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== user._id),
        }));
        await unfollowUser(profile._id);
      } else {
        setIsFollowing(true);
        setProfile((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), user._id],
        }));
        await followUser(profile._id);
      }
    } catch (err) {
      console.error("❌ Follow toggle error:", err);
      setIsFollowing((prev) => !prev);
    }
  };

  const handleLikeToggle = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, likes: p.likes + (likedPosts[postId] ? -1 : 1) }
          : p
      )
    );
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!profile)
    return <p className="text-center mt-10 text-white">User not found ❌</p>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔹 Light Maroon Gradient Background with Blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#b56576] via-[#c27c88] to-[#e8b4b8] blur-2xl scale-110"></div>

      {/* 🔹 Foreground Content */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 text-white">
        
        {/* 🌟 HEADER BAR (3 dots + username) */}
        <div className="flex items-center justify-between mb-6 px-2 py-3 bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/10">

        <h1 className="text-lg font-semibold tracking-wide">{profile.username}</h1>
          <BsThreeDotsVertical
            size={24}
            className="cursor-pointer text-white hover:scale-110 transition-transform"
            onClick={() => alert('Options menu coming soon!')}
          />
          
        </div>

       {/* 🌟 PROFILE HEADER (Horizontal Layout) */}
<div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between mb-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">

  {/* 👤 LEFT — PROFILE IMAGE */}
  <div className="flex justify-center sm:justify-start sm:w-auto">
    <img
      key={profile?.profilePic}
      src={resolveProfilePic(profile?.profilePic)}
      alt="profile"
      className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
      onError={(e) => (e.target.src = '/defaultProfile.png')}
    />
  </div>

  {/* 🧾 RIGHT — USER INFO */}
  <div className="flex flex-col sm:ml-8 mt-4 sm:mt-0 text-center sm:text-left text-white w-full">
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <h2 className="text-2xl font-bold">{profile.username}</h2>
      <p className="text-gray-100 text-sm mt-1 sm:mt-0">{profile.bio}</p>
    </div>

    {/* 📊 Stats Row */}
    <div className="flex justify-center sm:justify-start space-x-8 mt-3 text-sm">
      <div>
        <span className="font-semibold">{posts.length}</span> posts
      </div>
      <div>
        <span className="font-semibold">{profile.followers?.length || 0}</span> followers
      </div>
      <div>
        <span className="font-semibold">{profile.following?.length || 0}</span> following
      </div>
    </div>
  </div>
</div>

{/* 🎯 CENTERED BUTTONS BELOW PROFILE */}
<div className="flex justify-center flex-wrap gap-3 mt-4 mb-6">
  {isOwnProfile ? (
    <>
      <button
        onClick={() => navigate('/edit-profile', { state: { fromProfile: true } })}
        className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-md text-sm hover:bg-white/30 transition"
      >
        Edit Profile
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert('✅ Profile link copied!');
        }}
        className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-md text-sm hover:bg-white/30 transition"
      >
        Share
      </button>
    </>
  ) : (
    <>
      <button
        onClick={handleFollowToggle}
        className={`px-6 py-2 rounded-md text-sm backdrop-blur-md transition ${
          isFollowing ? 'bg-white/30 text-black' : 'bg-blue-600 text-white'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <button
        onClick={() => navigate(`/chat/${profile._id}`)}
        className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-md text-sm hover:bg-white/30 transition"
      >
        Message
      </button>
    </>
  )}
</div>



        <hr className="border-white/30 my-5" />

        {/* TABS */}
        <div className="flex justify-around border-t border-white/30">
          {["posts", "reels", "tagged"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wide ${
                activeTab === tab
                  ? "border-t-2 border-white text-white"
                  : "text-white/70"
              }`}
            >
              {tab === "posts"
                ? "📸 Posts"
                : tab === "reels"
                ? "🎥 Reels"
                : "🏷️ Tagged"}
            </button>
          ))}
        </div>

        {/* POSTS GRID */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1 mt-2">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="relative cursor-pointer hover:opacity-90"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-40 object-cover rounded-sm"
                  />
                </div>
              ))
            ) : (
              <p className="text-center w-full mt-8 text-white/80">
                No posts yet 📭
              </p>
            )}
          </div>
        )}

        {/* POST MODAL */}
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          isOwnProfile={isOwnProfile}
          onDelete={handleDelete}
          liked={selectedPost ? likedPosts[selectedPost._id] : false}
          onLikeToggle={handleLikeToggle}
        />
      </div>
    </div>
  );
};

export default Profile;
