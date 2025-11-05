import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const CreatePostComponent = ({ onPostCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null); // 🟢 Optional image/video file
  const [mediaPreview, setMediaPreview] = useState(null); // 🟢 Preview
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://bkc-dt1n.onrender.com";
  // const BACKEND_URL = "http://localhost:5000";

  /* -------------------- HANDLE MEDIA CHANGE -------------------- */
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);

    // 🖼 Create preview for image/video
    const previewURL = URL.createObjectURL(file);
    setMediaPreview(previewURL);
  };

  /* -------------------- HANDLE FORM SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return alert("Please enter title and content");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);
      if (media) formData.append("media", media); // 🟢 Optional media

      console.log("📤 Uploading post to:", `${BACKEND_URL}/posts`);
      for (let pair of formData.entries()) console.log(pair[0], pair[1]);

     const { data } = await axios.post(`${BACKEND_URL}/posts`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

console.log("✅ Post created successfully:", data);
console.log("🧩 Saved post mediaUrl:", data?.post?.mediaUrl);


      alert("✅ Post published successfully!");

      onPostCreated && onPostCreated(data.post);

      // Reset fields
      setTitle("");
      setSubtitle("");
      setContent("");
      setMedia(null);
      setMediaPreview(null);
      onClose && onClose();
    } catch (err) {
      console.error("❌ Post upload error:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to publish post."
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
        📝 Create Post
      </h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      {/* Subtitle */}
      <input
        type="text"
        placeholder="Subtitle (optional)"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      {/* Content */}
      <textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-3 border rounded-xl"
      />

      {/* Optional Media Upload */}
      <div>
        <label className="block font-medium mb-1">Attach Image or Video (optional):</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          className="w-full"
        />

        {/* Preview */}
        {mediaPreview && (
          <div className="mt-3 rounded-xl overflow-hidden border">
            {media?.type.startsWith("video/") ? (
              <video
                src={mediaPreview}
                controls
                className="w-full max-h-64 object-cover"
              />
            ) : (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full max-h-64 object-cover"
              />
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
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
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </motion.form>
  );
};

export default CreatePostComponent;
