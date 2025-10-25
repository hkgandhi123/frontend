import React, { useState } from "react";
import {
  XMarkIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const PostModal = ({ post, onClose, isOwnProfile, onDelete, liked, onLikeToggle }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!post) return null;

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(post._id);
  };

  const handleEdit = () => {
    setShowMenu(false);
    alert("Edit functionality coming soon ✏️");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-4xl w-full flex flex-col sm:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left - Image */}
        <div className="flex-1 bg-black flex justify-center items-center">
          <img
            src={post.image}
            alt={post.caption}
            className="max-h-[90vh] object-contain"
          />
        </div>

        {/* Right - Details */}
        <div className="w-full sm:w-80 flex flex-col justify-between p-4">
          {/* Header: Username + 3-dot menu */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={post.user?.profilePic || "/default-avatar.png"}
                alt={post.user?.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold">{post.user?.username}</span>
            </div>

            {isOwnProfile && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="p-1"
                >
                  <EllipsisVerticalIcon className="w-6 h-6 text-gray-600" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="text-gray-700 text-sm mb-4">{post.caption}</div>

          {/* Actions: Like, Comment */}
          <div className="flex items-center space-x-4 mb-3">
            <button onClick={() => onLikeToggle(post._id)}>
              <HeartIcon
                className={`w-6 h-6 ${liked ? "text-red-500" : "text-gray-400"}`}
              />
            </button>
            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-gray-400" />
          </div>

          {/* Likes count */}
          <div className="text-sm text-gray-600 mb-2">
            <b>{post.likes}</b> likes
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PostModal;
