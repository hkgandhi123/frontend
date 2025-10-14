import React from "react";
import { useNavigate } from "react-router-dom";
import { resolveURL } from "../api";

const PostCard = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${post.user._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* User info */}
      <div className="flex items-center mb-3">
        <img
          src={post.user?.profilePic ? resolveURL(post.user.profilePic) : "/default-avatar.png"}
          alt={post.user?.username || "User"}
          className="w-10 h-10 rounded-full object-cover mr-3 cursor-pointer"
          onClick={handleProfileClick}
        />
        <span
          className="font-medium cursor-pointer"
          onClick={handleProfileClick}
        >
          {post.user?.username || "User"}
        </span>

        {onDelete && (
          <button
            onClick={() => onDelete(post._id)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post image */}
      {post.image && (
        <img
          src={post.image.startsWith("http") ? post.image : resolveURL(post.image)}
          alt={post.caption || "Post"}
          className="w-full max-h-96 object-cover rounded mb-3"
        />
      )}

      {/* Caption */}
      {post.caption && <p className="text-gray-700">{post.caption}</p>}
    </div>
  );
};

export default PostCard;
