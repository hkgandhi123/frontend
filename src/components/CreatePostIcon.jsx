// components/CreatePostIcon.jsx
import React from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

function CreatePostIcon() {
  const { setPosts, backendURL } = useUserContext();

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const caption = prompt("Add a caption:") || "";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      const res = await axios.post(`${backendURL}/posts/create`, formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("Post uploaded ✅");
        setPosts((prev) => [res.data.post, ...prev]); // Update posts in context
      }
    } catch (err) {
      console.error("Post upload error:", err);
      alert("Failed to upload post ❌");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-2xl font-bold p-2 hover:bg-gray-200 rounded-full transition"
      title="Create Post"
    >
      +
    </button>
  );
}

export default CreatePostIcon;
