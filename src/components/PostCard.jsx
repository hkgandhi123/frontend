import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const PostCard = ({ post, onDelete }) => {
  const { user, backendURL } = useUserContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendURL}/posts/${post._id}`, {
        withCredentials: true,
      });
      onDelete(post._id); // remove from frontend
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      {/* Post Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={post.user?.profilePic || "/default.png"}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{post.user?.username}</span>
        </div>

        {/* 3 Dots Menu */}
        {user?._id === post.user?._id && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-gray-600 hover:text-black"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md">
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Caption */}
      <p className="mt-2">{post.caption}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="mt-2 rounded-lg w-full max-h-80 object-cover"
        />
      )}
    </div>
  );
};

export default PostCard;
