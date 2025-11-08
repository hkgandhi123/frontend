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
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [showUsernameMenu, setShowUsernameMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  



  const normalizePosts = (data) =>
    data.map((p) => ({
      ...p,
      image: p.mediaUrl ? resolveURLWithCacheBust(p.mediaUrl) : "/default-post.png",
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
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-emerald-700 blur-2xl scale-110"></div>

      {/* 🔹 Foreground Content */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 text-white">

      {/* 🌟 HEADER BAR (username + back arrow + 3-line menu or 3-dots) */}
<div className="flex w-full items-center justify-between mb-6 px-2 py-2 relative">
  {/* LEFT SIDE */}
  <div className="flex items-center gap-2">
    {isOwnProfile ? (
      // ✅ For own profile: username + dropdown
      <>
        <h1 className="text-lg font-semibold tracking-wide">{profile.username}</h1>
        <div className="relative">
          <button
            onClick={() => setShowUsernameMenu((prev) => !prev)}
            className="text-white hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUsernameMenu && (
            <div className="absolute left-0 top-6 bg-white text-black text-sm rounded-md shadow-lg border border-gray-200 z-50 w-40">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowUsernameMenu(false);
                  navigate("/edit-profile", { state: { fromUsernameEdit: true } });
                }}
              >
                ✏️ Edit Username
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => setShowUsernameMenu(false)}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </>
    ) : (
      // ✅ For public (other) profiles: back arrow + username
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold tracking-wide">{profile.username}</h1>
      </div>
    )}
  </div>

  {/* RIGHT SIDE */}
  {isOwnProfile ? (
    // ✅ Own profile: 3-line settings menu
    <div className="relative">
      <button
        className="text-white hover:scale-110 transition-transform"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-8 bg-white text-black text-sm rounded-md shadow-lg border border-gray-200 z-50 w-44">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setShowMenu(false);
              navigate("/settings");
            }}
          >
            ⚙️ Settings
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setShowMenu(false);
              navigate("/privacy");
            }}
          >
            🔒 Privacy
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            onClick={() => {
              setShowMenu(false);
              alert("🚪 Logged out!");
              navigate("/login");
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    // ✅ Public profile: 3-dot menu (Restrict, Block, Report)
    <div className="relative">
      <button
        className="text-white hover:scale-110 transition-transform"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <BsThreeDotsVertical size={22} />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-8 bg-white text-black text-sm rounded-md shadow-lg border border-gray-200 z-50 w-40">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setShowMenu(false);
              alert("🚫 User restricted");
            }}
          >
            🚫 Restrict
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            onClick={() => {
              setShowMenu(false);
              alert("⛔ User blocked");
            }}
          >
            ⛔ Block
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-yellow-600"
            onClick={() => {
              setShowMenu(false);
              alert("⚠️ User reported");
            }}
          >
            ⚠️ Report
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => setShowMenu(false)}
          >
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  )}
</div>



        {/* 🌟 PROFILE HEADER with CHANGE COVER ICON */}
        <div className="relative w-full  rounded-2xl overflow-hidden ">

          {/* 🖼️ COVER IMAGE */}
          <div className="relative h-32 sm:h-48 w-full bg-white/10 border-w/10">
            <img
              src={profile?.profilePic || "/defaultCover.jpg"}
              alt="profile"
              className="w-full h-full object-cover transition-transform duration-300"
              onError={(e) => (e.target.src = "/defaultCover.jpg")}
            />
            {/* 📸 CHANGE COVER ICON */}
            <div className="absolute bottom-2 right-2">
              <div className="relative group">
                {/* 🔘 Camera Icon */}
                <button
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCoverMenu((prev) => !prev);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5L19.5 6.75m0 0l3.75 3.75M19.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75A2.25 2.25 0 016.75 4.5h5.25"
                    />
                  </svg>
                </button>

                {/* ⚙️ MENU */}
                {showCoverMenu && (
                  <div className="absolute right-0 bottom-10 bg-white text-black text-sm rounded-lg shadow-xl border border-gray-200 z-50 w-48">
                    {/* ✏️ Edit */}
                    <label
                      htmlFor="coverUpload"
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      ✏️ Edit
                    </label>
                    <input
                      id="coverUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setPreviewCover(preview);
                          setNewCoverFile(file);
                          alert("✅ Image selected — now click Update Cover Photo");
                        }
                      }}
                    />

                    {/* 🔄 Update */}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={async () => {
                        if (!newCoverFile) return alert("⚠️ Please select a new image first!");
                        const formData = new FormData();
                        formData.append("coverPic", newCoverFile);

                        try {
                          const res = await fetch("https://bkc-dt1n.onrender.com/update-cover", {
                            method: "PUT",
                            credentials: "include",
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert("✅ Cover photo updated!");
                            window.location.reload();
                          } else {
                            alert("❌ Update failed");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("⚠️ Error updating cover photo");
                        }
                        setShowCoverMenu(false);
                      }}
                    >
                      🔄 Update
                    </button>

                    {/* 🗑️ Delete */}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      onClick={async () => {
                        try {
                          const res = await fetch("https://bkc-dt1n.onrender.com/remove-cover", {
                            method: "DELETE",
                            credentials: "include",
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert("🗑️ Cover photo removed!");
                            window.location.reload();
                          } else {
                            alert("❌ Remove failed");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("⚠️ Error removing cover photo");
                        }
                        setShowCoverMenu(false);
                      }}
                    >
                      🗑️ Delete
                    </button>

                    {/* ❌ Cancel */}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowCoverMenu(false)}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 👤 PROFILE + INFO SECTION */}
          <div className="relative flex flex-row items-start sm:items-center p-4 sm:p-6 gap-6 sm:gap-10  backdrop-blur-md rounded-b-2xl ">
            {/* 👤 PROFILE IMAGE + BIO */}
            <div className="flex flex-col items-center text-center w-28 sm:w-32 -mt-10 sm:-mt-16">
              <img
                key={profile?.profilePic}
                src={resolveProfilePic(profile?.profilePic)}
                alt="profile"
                className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 bg-gray-200"
                onError={(e) => (e.target.src = '/defaultProfile.png')}
              />
              {profile.bio && (
                <p className="text-gray-300 text-xs sm:text-sm mt-2 italic leading-snug">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* 🧾 USERNAME + STATS */}
            <div className="flex flex-col justify-center text-left text-white flex-1 mt-2 sm:mt-0">
              <h2 className="text-lg sm:text-2xl font-bold mb-2">{profile.username}</h2>

              <div className="flex flex-row justify-start space-x-6 sm:space-x-10 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-base sm:text-lg">{posts.length}</span>
                  <span className="text-xs sm:text-sm text-gray-300">posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-base sm:text-lg">{profile.followers?.length || 0}</span>
                  <span className="text-xs sm:text-sm text-gray-300">followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-base sm:text-lg">{profile.following?.length || 0}</span>
                  <span className="text-xs sm:text-sm text-gray-300">following</span>
                </div>
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
                className={`px-6 py-2 rounded-md text-sm backdrop-blur-md transition ${isFollowing ? 'bg-white/30 text-black' : 'bg-blue-600 text-white'
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



        {/* 🌈 HIGHLIGHT SECTION */}
<div className="flex overflow-x-auto space-x-4 py-3 px-1 scrollbar-hide">
  {/* ➕ Add Highlight (only for own profile) */}
  {isOwnProfile && (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => alert("✨ Add new highlight feature coming soon!")}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 border-dashed border-white/50 bg-white/10 hover:bg-white/20 transition">
        <span className="text-3xl text-white/80">+</span>
      </div>
      <p className="text-xs text-white mt-1">New</p>
    </div>
  )}

  {/* Example Highlights */}
  {[
    { id: 1, name: "Travel", img: "/highlights/travel.jpg" },
    { id: 2, name: "Food", img: "/highlights/food.jpg" },
    { id: 3, name: "Friends", img: "/highlights/friends.jpg" },
    { id: 4, name: "Gym", img: "/highlights/gym.jpg" },
  ].map((highlight) => (
    <div key={highlight.id} className="flex flex-col items-center flex-shrink-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-pink-400 p-[2px] bg-gradient-to-tr from-pink-400 to-yellow-300 hover:scale-105 transition">
        <img
          src={highlight.img}
          alt={highlight.name}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => (e.target.src = '/defaultHighlight.jpg')}
        />
      </div>
      <p className="text-xs text-white mt-1 truncate w-16 text-center">{highlight.name}</p>
    </div>
  ))}
</div>


        {/* TABS */}
        <div className="flex justify-around border-t border-white/30">
          {["posts", "reels", "tagged"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wide ${activeTab === tab
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
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-md"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.image}
                    alt={post.caption || "Post"}
                    className="w-full h-40 sm:h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Optional hover overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm">View</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-full mt-8 text-white/80">No posts yet 📭</p>
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
