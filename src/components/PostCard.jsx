import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MessageCircle,
  Share2,
} from "lucide-react";
import { resolveURLWithCacheBust } from "../utils/resolveURL";

const PostCard = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(post?.votes || 0);
  const [hasVoted, setHasVoted] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [views, setViews] = useState(post?.views || 0);

  // 👁️ Increase views when post is loaded
  useEffect(() => {
    setViews((prev) => prev + 1);
    // Optional: send view to backend
    // fetch(`/api/posts/${post._id}/view`, { method: "POST" });
  }, [post?._id]);

  const handleUpvote = () => {
    if (hasVoted === "up") return;
    setVotes((prev) => prev + (hasVoted === "down" ? 2 : 1));
    setHasVoted("up");
  };

  const handleDownvote = () => {
    if (hasVoted === "down") return;
    setVotes((prev) => prev - (hasVoted === "up" ? 2 : 1));
    setHasVoted("down");
  };

  const goToProfile = () => {
    if (post?.user?._id) navigate(`/profile/${post.user._id}`);
  };

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    // Optionally call API to follow/unfollow
  };

  const handleComments = () => {
    if (post?._id) navigate(`/post/${post._id}/comments`);
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post?._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert("📋 Post link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy link!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-700 p-[1px] rounded-2xl shadow-lg max-w-screen-md mx-auto my-6">
      <div className="bg-gray-100 rounded-2xl p-5 relative overflow-hidden">
        {/* Left-side vote arrows */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center text-yellow-400 h-full justify-center space-y-5">
          <ArrowUpIcon
            size={36}
            className={`cursor-pointer transform scale-y-[3] ${hasVoted === "up" ? "text-green-500" : ""}`}
            onClick={handleUpvote}
          />
          <span className="text-lg font-semibold">{votes}</span>
          <ArrowDownIcon
            size={36}
            className={`cursor-pointer transform scale-y-[3] ${hasVoted === "down" ? "text-red-500" : ""}`}
            onClick={handleDownvote}
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-3 ml-8">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={goToProfile}>
            <img
              src={post?.user?.profilePic ? resolveURLWithCacheBust(post.user.profilePic) : "https://via.placeholder.com/50"}
              alt={post?.user?.username || "User"}
              className="w-10 h-10 rounded-full border object-cover"
            />
            <div>
              <h2 className="font-bold text-lg text-gray-800">{post?.user?.username || "User"}</h2>
              <p className="text-xs text-gray-500">{post?.user?.bio || "No bio"}</p>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollow}
            className={`px-3 py-1 text-sm rounded-md border transition font-medium ${
              isFollowing
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "text-blue-600 border-blue-500 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        {/* Post Content */}
        <div className="ml-8 mt-3">
          {post?.content && (
            <p className="text-gray-800 text-base font-medium mb-3 leading-relaxed">{post.content}</p>
          )}
          {post?.image && (
            <div className="w-full rounded-xl overflow-hidden border border-gray-200">
              <img
                src={resolveURLWithCacheBust(post.image)}
                alt="Post"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center mt-3 ml-8 text-gray-700">
          {/* Views */}
          <div className="flex items-center space-x-1">
            <EyeIcon size={18} />
            <span className="font-semibold">{views}</span>
          </div>

          {/* Share + Comments */}
          <div className="flex items-center space-x-3">
            <Share2 size={18} className="cursor-pointer hover:text-blue-600" onClick={handleShare} />
            <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600" onClick={handleComments}>
              <MessageCircle size={18} />
              <span className="font-semibold">{post?.comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
