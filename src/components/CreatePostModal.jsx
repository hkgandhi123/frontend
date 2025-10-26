import React from "react";
import CreatePost from "../pages/CreatePost";
import { useUserContext } from "../context/UserContext";

const CreatePostModal = ({ onClose }) => {
  const { addNewPost } = useUserContext();

  // Callback when a new post is successfully created
  const handlePostCreated = (newPost) => {
    addNewPost(newPost); // Update Home + Profile instantly
    onClose(); // Close modal
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-lg w-11/12 sm:w-96 p-4 relative shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* CreatePost Component */}
        <CreatePost
          onPostCreated={handlePostCreated}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default CreatePostModal;
