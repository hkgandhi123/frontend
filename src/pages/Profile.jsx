import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { getProfile, deletePost, followUser, unfollowUser } from "../api";
import PostModal from "../components/PostModal";

// Followers / Following Modal
const UserListModal = ({ title, users, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white w-96 p-4 rounded shadow-lg max-h-[80vh] overflow-y-auto relative">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <button
        className="absolute top-2 right-4 text-xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
      <ul>
        {users.map((u) => (
          <li key={u._id} className="flex items-center space-x-2 mb-2">
            <img
              src={u.profilePic || "/default-avatar.png"}
              alt={u.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{u.username}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Profile = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, newPostGlobal } = useUserContext();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Normalize posts
  const normalizePosts = (data) =>
    data.map((p) => ({
      ...p,
      image: p.image || "/default-post.png",
      user: {
        ...p.user,
        profilePic: p.user?.profilePic || "/default-avatar.png",
      },
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
        if (!data || !data._id) return setProfile(null);

        // Followers / Following details
        const followersDetailed = await Promise.all(
          (data.followers || []).map(async (fid) => {
            try {
              const u = await getProfile(fid);
              return { _id: u._id, username: u.username, profilePic: u.profilePic };
            } catch {
              return null;
            }
          })
        );

        const followingDetailed = await Promise.all(
          (data.following || []).map(async (fid) => {
            try {
              const u = await getProfile(fid);
              return { _id: u._id, username: u.username, profilePic: u.profilePic };
            } catch {
              return null;
            }
          })
        );

        setProfile({
          ...data,
          followers: followersDetailed.filter(Boolean),
          following: followingDetailed.filter(Boolean),
        });

        setPosts(normalizePosts(data.posts || []));
        if (user && (data.followers || []).includes(user._id)) setIsFollowing(true);
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [paramId, user]);

  useEffect(() => {
    if (!newPostGlobal || !profile) return;
    if (newPostGlobal.user._id === profile._id)
      setPosts((prev) => [newPostGlobal, ...prev]);
  }, [newPostGlobal, profile]);

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
    if (!profile) return;
    try {
      if (isFollowing) {
        await unfollowUser(profile._id);
        setIsFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followers: prev.followers.filter((f) => f._id !== user._id),
        }));
      } else {
        await followUser(profile._id);
        setIsFollowing(true);
        setProfile((prev) => ({
          ...prev,
          followers: [
            ...(prev.followers || []),
            { _id: user._id, username: user.username, profilePic: user.profilePic },
          ],
        }));
      }
    } catch (err) {
      console.error("❌ Follow toggle error:", err);
    }
  };

  const handleLikeToggle = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, likes: p.likes + (likedPosts[postId] ? -1 : 1) } : p
      )
    );
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!profile) return <p className="text-center mt-4">User not found ❌</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-10 mb-6">
        <img
          src={profile.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border mx-auto sm:mx-0"
        />
        <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
          <h2 className="text-xl font-semibold">{profile.username}</h2>
          <div className="flex justify-center sm:justify-start space-x-8 mt-3">
            <div><span className="font-semibold">{posts.length}</span> posts</div>
            <div className="cursor-pointer" onClick={() => setShowFollowers(true)}>
              <span className="font-semibold">{profile.followers?.length || 0}</span> followers
            </div>
            <div className="cursor-pointer" onClick={() => setShowFollowing(true)}>
              <span className="font-semibold">{profile.following?.length || 0}</span> following
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center sm:text-left">{profile.bio}</div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-3 justify-center sm:justify-start">
        {isOwnProfile ? (
          <>
            <button onClick={() => navigate("/edit-profile")} className="px-4 py-1 bg-gray-200 rounded-md text-sm">Edit Profile</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Profile link copied!"); }} className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm">Share Profile</button>
          </>
        ) : (
          <>
            <button onClick={handleFollowToggle} className={`px-4 py-1 rounded-md text-sm ${isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"}`}>
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button onClick={() => navigate(`/messages/${profile._id}`)} className="px-4 py-1 bg-green-500 text-white rounded-md text-sm">Message</button>
          </>
        )}
      </div>

      <hr className="border-gray-300 my-4" />

      {/* Tabs */}
      <div className="flex justify-around border-t border-gray-300">
        {["posts", "reels", "tagged"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wide ${activeTab === tab ? "border-t-2 border-black text-black" : "text-gray-500"}`}
          >
            {tab === "posts" ? "📸 Posts" : tab === "reels" ? "🎥 Reels" : "🏷️ Tagged"}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {activeTab === "posts" && (
        <div className="grid grid-cols-3 gap-1 mt-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="relative cursor-pointer" onClick={() => setSelectedPost(post)}>
                <img src={post.image} alt={post.caption} className="w-full h-40 object-cover" />
              </div>
            ))
          ) : (
            <p className="text-center w-full mt-8 text-gray-500">No posts yet 📭</p>
          )}
        </div>
      )}

      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        isOwnProfile={isOwnProfile}
        onDelete={handleDelete}
        liked={selectedPost ? likedPosts[selectedPost._id] : false}
        onLikeToggle={handleLikeToggle}
      />

      {showFollowers && <UserListModal title="Followers" users={profile.followers || []} onClose={() => setShowFollowers(false)} />}
      {showFollowing && <UserListModal title="Following" users={profile.following || []} onClose={() => setShowFollowing(false)} />}
    </div>
  );
};

export default Profile;
