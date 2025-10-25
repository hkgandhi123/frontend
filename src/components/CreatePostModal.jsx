import React from "react";
import CreatePost from "../pages/CreatePost";
import { useUserContext } from "../context/UserContext";

const CreatePostModal = ({ onClose }) => {
  const { addNewPost } = useUserContext();

<<<<<<< HEAD
  // Callback when a new post is successfully created
  const handlePostCreated = (newPost) => {
    addNewPost(newPost); // Update Home + Profile instantly
    onClose(); // Close modal
=======
  const handlePostCreated = (newPost) => {
    addNewPost(newPost); // ✅ update Home + Profile
    onClose();
>>>>>>> fe70d9c5daaa1f31094195729d728914a6f01d31
  };

  return (
    <div
<<<<<<< HEAD
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-opacity"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-700 p-[1px] rounded-2xl shadow-2xl w-11/12 sm:w-[420px] relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="bg-white rounded-2xl p-5 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold transition-transform hover:scale-110"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
            ✨ Create a New Post
          </h2>

          {/* CreatePost Component */}
          <CreatePost
            onPostCreated={handlePostCreated}
            onClose={onClose}
          />
        </div>
=======
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-11/12 sm:w-96 p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <CreatePost onPostCreated={handlePostCreated} onClose={onClose} />
>>>>>>> fe70d9c5daaa1f31094195729d728914a6f01d31
      </div>
    </div>
  );
};

export default CreatePostModal;
