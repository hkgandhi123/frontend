import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import PostCard from "./PostCard"; // ✅ import your PostCard component

const PostModal = ({
  post,
  onClose,
  isOwnProfile,
  onDelete,
  liked,
  onLikeToggle,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!post) return null;

  // 🧩 Debug Log — see what data is coming in
  console.log("🧩 PostModal received post:", post);

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) onDelete(post._id);
  };

  const handleEdit = () => {
    setShowMenu(false);
    alert("✏️ Edit functionality coming soon");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ If PostCard fails to show image, we’ll show backup here */}
        {!post.image && !post.mediaUrl ? (
          <img
            src="/default-post.png"
            alt="default post"
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
        ) : null}

        {/* ✅ PostCard displays the actual post */}
        <PostCard
          post={{
            ...post,
            image: post.image || post.mediaUrl || "/default-post.png",
          }}
        />

        {/* ✏️ Optional Edit/Delete menu for your own posts */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="bg-white/10 text-white px-2 py-1 rounded hover:bg-white/20"
            >
              ⋮
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

      {/* ❌ Close Button */}
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
