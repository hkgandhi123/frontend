import React from "react";
import CreatePost from "../pages/CreatePost";
import { useUserContext } from "../context/UserContext";

const CreatePostModal = ({ onClose }) => {
  const { addNewPost } = useUserContext();

  const handlePostCreated = (newPost) => {
    addNewPost(newPost); // ✅ update Home + Profile
    onClose();
  };

  return (
    <div
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
      </div>
    </div>
  );
};

export default CreatePostModal;
