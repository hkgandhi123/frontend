import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuChevronUp,
  LuChevronDown,
  LuBookmark,
  LuRepeat,
} from "react-icons/lu";
import {
  EyeIcon,
  MessageCircle,
  Share2,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import { resolveURLWithCacheBust } from "../utils/resolveURL";
import { useUserContext } from "../context/UserContext";
import { followUser, unfollowUser } from "../api";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();

  const [views, setViews] = useState(post?.views || 0);
  const [votes, setVotes] = useState(50);
  const [hasVoted, setHasVoted] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [repostCount, setRepostCount] = useState(post?.reposts || 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(Boolean(post?.user?.isFollowing));

  useEffect(() => setViews((prev) => prev + 1), [post?._id]);

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

  const handleComments = () => {
    if (post?._id) navigate(`/post/${post._id}/comments`);
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post?._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert("📋 Post link copied!");
    } catch {
      alert("❌ Failed to copy link!");
    }
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
    setVotes((prev) => Math.min(prev + 20, 100));
    setHasVoted("up");
  };

  const handleDownvote = () => {
    if (hasVoted === "down") return;
    setVotes((prev) => Math.max(prev - 20, 0));
    setHasVoted("down");
  };

  const getRankingLabel = (percent) => {
    if (percent >= 90) return "🥇 Excellent";
    if (percent >= 70) return "🥈 Good";
    if (percent >= 50) return "😐 Average";
    if (percent >= 30) return "👎 Poor";
    return "🚫 Bad";
  };

  const progressBarStyle = {
    height: `${votes}%`,
    background: `linear-gradient(to top, #f87171, #facc15, #22c55e)`,
    boxShadow: `0 0 10px ${
      votes >= 70 ? "#22c55e" : votes >= 40 ? "#facc15" : "#f87171"
    }`,
    transition: "height 0.5s ease, box-shadow 0.5s ease",
    borderRadius: "9999px",
    width: "100%",
  };

  const fullText =
    post?.content || post?.article || post?.caption || "No content provided.";
  const shortText =
    fullText.length > 180 ? fullText.slice(0, 180) + "..." : fullText;

  const mediaUrl = post?.media || post?.image;
  const isVideo =
    mediaUrl?.endsWith(".mp4") ||
    mediaUrl?.includes("video") ||
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

  return (
    <div className="bg-gradient-to-br from-purple-800 via-blue-700 to-blue-900 text-white border border-gray-700 shadow-lg max-w-2xl mx-auto my-4 hover:shadow-2xl transition relative overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-purple-700/50 to-blue-700/50 backdrop-blur-sm">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={goToProfile}
        >
          <img
            src={profilePicToShow}
            alt={post?.user?.username || "User"}
            className="w-10 h-10 rounded-full object-cover border border-white/50"
          />
          <h2 className="font-semibold text-white drop-shadow">
            {post?.user?.username || "Anonymous"}
          </h2>
        </div>

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
      </div>

      {/* Main Content */}
      <div className="flex flex-row justify-between items-stretch p-2">
        {/* Left Voting */}
        <div className="flex flex-col items-center justify-center space-y-2 min-w-[50px]">
          <ArrowUpIcon
            size={30}
            className={`cursor-pointer ${
              hasVoted === "up" ? "text-green-400" : "text-white/60"
            } hover:text-green-300`}
            onClick={handleUpvote}
          />
          <span className="text-yellow-300 font-medium text-sm">{votes}%</span>
          <div className="relative h-32 w-3 bg-white/20 overflow-hidden flex items-end rounded-full">
            <div style={progressBarStyle}></div>
          </div>
          <ArrowDownIcon
            size={30}
            className={`cursor-pointer ${
              hasVoted === "down" ? "text-red-400" : "text-white/60"
            } hover:text-red-300`}
            onClick={handleDownvote}
          />
          <span className="font-semibold text-xs text-gray-200 text-center">
            {getRankingLabel(votes)}
          </span>
        </div>

        {/* Post Body */}
        <div className="flex-1 relative mx-2">
          {post?.title && (
            <h2 className="text-xl font-bold text-yellow-300 mb-1 drop-shadow">
              {post.title}
            </h2>
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

          {mediaUrl && (
            <div className="relative overflow-hidden border border-white/20 mb-3 rounded-md">
              {isVideo ? (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full max-h-80 rounded-md"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="Post media"
                  className="w-full object-cover max-h-80"
                />
              )}
            </div>
          )}
        </div>

        {/* Right Voting */}
        <div className="flex flex-col items-center justify-center space-y-6 min-w-[50px]">
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
      <div className="flex justify-between items-center p-4 border-t border-white/10 bg-gradient-to-r from-blue-800/50 to-purple-700/50 text-gray-200 text-sm">
        <div className="flex items-center space-x-3">
          <EyeIcon size={16} />
          <span>{views}</span>

          <div className="flex items-center space-x-1">
            <LuRepeat
              size={20}
              className="cursor-pointer hover:text-yellow-300"
              onClick={handleRepost}
              title="Repost"
            />
            <span className="text-sm">{repostCount}</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <MessageCircle
            size={16}
            className="cursor-pointer hover:text-blue-300"
            onClick={handleComments}
          />
          <Share2
            size={16}
            className="cursor-pointer hover:text-green-300"
            onClick={handleShare}
          />
          <LuBookmark
            size={18}
            className={`cursor-pointer transition ${
              isSaved ? "text-yellow-400 fill-yellow-400" : "text-white/60"
            }`}
            onClick={handleSave}
            title={isSaved ? "Unsave Post" : "Save Post"}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
