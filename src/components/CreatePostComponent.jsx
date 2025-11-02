import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const CreatePostComponent = ({ onPostCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Backend URL
  const BACKEND_URL = "https://bkc-dt1n.onrender.com";
  // const BACKEND_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return alert("Please enter title and content");
    }

    try {
      setLoading(true);

      // 🔹 Send only text fields (no file)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);

      console.log("📤 Uploading text-only post to:", `${BACKEND_URL}/posts`);
      for (let pair of formData.entries()) console.log(pair[0], pair[1]);

      const { data } = await axios.post(`${BACKEND_URL}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("✅ Post created successfully:", data);
      alert("✅ Text-only post published successfully!");

      onPostCreated && onPostCreated(data.post);
      setTitle("");
      setSubtitle("");
      setContent("");
      onClose && onClose();
    } catch (err) {
      console.error("❌ Post upload error:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to publish text-only post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        📝 Text-only Post Test
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      <input
        type="text"
        placeholder="Subtitle (optional)"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      <textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-3 border rounded-xl"
      />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Text Post"}
        </button>
      </div>
    </motion.form>
  );
};

export default CreatePostComponent;
