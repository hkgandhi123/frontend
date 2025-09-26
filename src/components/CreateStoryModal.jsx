// src/components/CreatePostModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const CreatePostModal = ({ isOpen, onClose }) => {
  const { posts, setPosts, backendURL, user } = useUserContext();
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
  };

  const handleUpload = async () => {
    if (!imageFile) return alert("Select an image first!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);

      const res = await axios.post(`${backendURL}/posts`, formData, {
        withCredentials: true,
      });

      // ✅ Nayi post ko Cloudinary URL ke saath feed me add karna
      const newPost = {
        ...res.data.post,
        image: res.data.post.image.startsWith("http")
          ? res.data.post.image
          : `${backendURL}${res.data.post.image}`,
        user: {
          ...res.data.post.user,
          profilePic: res.data.post.user.profilePic
            ? res.data.post.user.profilePic.startsWith("http")
              ? res.data.post.user.profilePic
              : `${backendURL}${res.data.post.user.profilePic}`
            : "/default-avatar.png",
        },
      };

      setPosts([newPost, ...posts]);
      onClose();
      setCaption("");
      setImageFile(null);
    } catch (err) {
      console.error("❌ Post upload error:", err.response?.data || err.message);
      alert("Failed to upload post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border p-2 rounded w-full mt-2 resize-none"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
