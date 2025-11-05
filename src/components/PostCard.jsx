import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuChevronUp, LuChevronDown, LuBookmark, LuRepeat } from "react-icons/lu";
import { EyeIcon, MessageCircle } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbShare3 } from "react-icons/tb";
import { resolveURLWithCacheBust } from "../utils/resolveURL";
import { useUserContext } from "../context/UserContext";
import { followUser, unfollowUser } from "../api";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();

  const [progress, setProgress] = useState(() => {
    if (post?.votes !== undefined) return post.votes;
    return Math.floor(Math.random() * 11);
  });
  const [views, setViews] = useState(post?.views || 0);
  const [hasVoted, setHasVoted] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [repostCount, setRepostCount] = useState(post?.reposts || 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(Boolean(post?.user?.isFollowing));
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false); // 👈 comment modal state
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const menuRef = useRef(null);

  useEffect(() => {
    setViews((prev) => prev + 1);
    setProgress((prev) => prev + 0.1);
  }, [post?._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOwnPost = post?.user?._id === currentUser?._id;

  const profilePicToShow =
    post?.user?._id === currentUser?._id
      ? currentUser?.profilePic
      : post?.user?.profilePic
      ? resolveURLWithCacheBust(post.user.profilePic)
      : "https://via.placeholder.com/50";

  const goToProfile = () => {
    if (post?.user?._id) navigate(`/profile/${post.user._id}`);
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
    alert(isSaved ? "❌ Post unsaved!" : "🔖 Post saved!");
  };

  const handleRepost = () => {
    setRepostCount((prev) => prev + 1);
    alert("🔁 Post reposted!");
  };

  const handleUpvote = () => {
    if (hasVoted === "up") return;
    setProgress((prev) => Math.min(prev + 1, 100));
    setHasVoted("up");
  };

  const handleDownvote = () => {
    if (hasVoted === "down") return;
    setProgress((prev) => prev - 1);
    setHasVoted("down");
  };

  const getRankingLabel = (percent) => {
    if (percent < 0) return "🚫 Bad";
    if (percent <= 10) return "Hope";
    if (percent >= 90) return "🥇 A+";
    if (percent >= 70) return "🥈 A";
    if (percent >= 50) return "😐 B";
    if (percent >= 30) return "👎 C";
    return "🚫 Bad";
  };

  const progressBarStyle = {
    height: `${Math.max(0, Math.min(progress, 100))}%`,
    background:
      progress < 0
        ? "#ef4444"
        : progress <= 10
        ? "#60a5fa"
        : `linear-gradient(to top, #f87171, #facc15, #22c55e)`,
    boxShadow: `0 0 10px ${
      progress >= 70
        ? "#22c55e"
        : progress >= 40
        ? "#facc15"
        : progress < 0
        ? "#ef4444"
        : "#60a5fa"
    }`,
    transition: "height 0.4s ease, box-shadow 0.4s ease",
    borderRadius: "9999px",
    width: "100%",
  };

  const fullText = post?.content || post?.article || post?.caption || "No content provided.";
  const shortText = fullText.length > 180 ? fullText.slice(0, 180) + "..." : fullText;

  const mediaItems = Array.isArray(post?.media)
    ? post.media
    : post?.media
    ? [post.media]
    : post?.image
    ? [post.image]
    : post?.file
    ? [post.file]
    : post?.mediaUrl
    ? [post.mediaUrl]
    : [];

  const isVideoFile = (url) =>
    url?.endsWith(".mp4") ||
    url?.endsWith(".mov") ||
    url?.endsWith(".webm") ||
    url?.includes("video") ||
    post?.mediaType === "video";

  const handleFollowToggle = async () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    try {
      if (newFollowState) {
        await followUser(post.user._id);
        alert(`✅ Followed ${post.user.username}`);
      } else {
        await unfollowUser(post.user._id);
        alert(`❌ Unfollowed ${post.user.username}`);
      }
    } catch (err) {
      console.error("❌ Follow toggle error:", err);
      setIsFollowing(!newFollowState);
    }
  };

  // 🗨️ Comment add handler
  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: Date.now(),
      username: currentUser?.username || "You",
      text: newComment.trim(),
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <>
      {/* 🧱 Post Card */}
      <div className="bg-gradient-to-br from-purple-500 via-blue-300 to-blue-500 text-white border border-gray-700 shadow-lg max-w-2xl mx-auto my-4 hover:shadow-2xl transition relative overflow-hidden w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-1 backdrop-blur-sm relative" ref={menuRef}>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={goToProfile}>
            <img
              src={profilePicToShow}
              alt={post?.user?.username || "User"}
              className="w-10 h-10 rounded-full object-cover border border-white/50"
            />
            <h2 className="font-semibold text-white drop-shadow">
              {post?.user?.username || "Anonymous"}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {!isOwnPost && post?.user && (
              <button
                onClick={handleFollowToggle}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  isFollowing
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {isOwnPost && (
              <div className="relative">
                <BsThreeDotsVertical
                  size={21}
                  className="cursor-pointer text-white hover:scale-110 transition-transform"
                  onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => {
                        alert("🫣 Post hidden!");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => {
                        alert("🗄️ Post archived!");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Archive
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-row justify-between items-stretch p-2">
          <div className="flex flex-col items-center justify-center space-y-2 min-w-[0px]">
            <span className="text-yellow-300 font-medium text-sm">{progress.toFixed(1)}%</span>
            <div className="relative h-32 w-3 bg-white/20 overflow-hidden flex items-end rounded-full">
              <div style={progressBarStyle}></div>
            </div>
            <span className="font-semibold text-xs text-gray-200 text-center">
              {getRankingLabel(progress)}
            </span>
          </div>

          {/* Post Body */}
          <div className="flex-1 relative mx-2">
            {post?.title && (
              <h2 className="text-xl font-bold text-yellow-300 mb-1 drop-shadow">{post.title}</h2>
            )}

            {fullText && (
              <div className="text-gray-100 text-base mb-3 leading-relaxed">
                <p>{isExpanded ? fullText : shortText}</p>
                {fullText.length > 180 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-300 text-sm mt-1 hover:underline"
                  >
                    {isExpanded ? "Read Less ▲" : "Read More ▼"}
                  </button>
                )}
              </div>
            )}

            {mediaItems.length > 0 && (
              <div className="relative w-full space-y-3 mb-3">
                {mediaItems.map((url, index) => {
                  const finalUrl = resolveURLWithCacheBust(
                    url.startsWith("http") ? url : `https://bkc-dt1n.onrender.com${url}`
                  );
                  return (
                    <div key={index} className="overflow-hidden border border-white/20 rounded-md">
                      {isVideoFile(finalUrl) ? (
                        <video src={finalUrl} controls className="w-full max-h-80 rounded-md" />
                      ) : (
                        <img
                          src={finalUrl}
                          alt="Post media"
                          className="w-full object-cover max-h-80 rounded-md"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Voting Buttons */}
          <div className="flex flex-col items-center justify-center space-y-6 min-w-[40px]">
            <LuChevronUp
              size={40}
              className={`cursor-pointer ${
                hasVoted === "up" ? "text-green-400" : "text-white/60"
              } hover:text-green-300`}
              onClick={handleUpvote}
            />
            <LuChevronDown
              size={40}
              className={`cursor-pointer ${
                hasVoted === "down" ? "text-red-400" : "text-white/60"
              } hover:text-red-300`}
              onClick={handleDownvote}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-2 border-t border-white/10 bg-gradient-to-r from-blue-800/50 to-purple-700/50 text-gray-200 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <EyeIcon size={16} className="text-blue-300" />
              <span>{views}</span>
            </div>

            <div className="flex items-center space-x-1">
              <LuRepeat
                size={18}
                onClick={handleRepost}
                title="Repost"
                className="cursor-pointer hover:scale-110 transition-transform duration-300"
              />
              <span className="text-sm">{repostCount}</span>
            </div>
          </div>

          {/* 💬 Comment + Share + Save */}
          <div className="flex items-center space-x-5">
            <MessageCircle
              size={18}
              onClick={() => setShowComments(true)} // 👈 open modal
              className="cursor-pointer text-blue-300 hover:text-blue-400 hover:scale-110 transition-transform duration-300"
              title="Comments"
            />

            <TbShare3
              size={20}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${window.location.origin}/post/${post?._id}`);
                  alert("✅ Link copied!");
                } catch {
                  alert("❌ Failed to copy link!");
                }
              }}
              className="cursor-pointer hover:scale-110 transition-transform duration-300"
              title="Share Post"
            />

            <LuBookmark
              size={18}
              onClick={handleSave}
              title={isSaved ? "Unsave Post" : "Save Post"}
              className={`cursor-pointer hover:scale-110 transition-transform duration-300 ${
                isSaved ? "text-yellow-400" : "text-white/60 hover:text-yellow-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* 🗨️ Comment Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-4 relative">
            <button
              onClick={() => setShowComments(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Comments ({comments.length})
            </h2>

            <div className="max-h-60 overflow-y-auto mb-3 space-y-2">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="border-b border-gray-200 pb-1 text-gray-700"
                  >
                    <strong>{c.username}: </strong>
                    <span>{c.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet. Be first!</p>
              )}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
