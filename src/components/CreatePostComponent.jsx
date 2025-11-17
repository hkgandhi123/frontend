import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const CreatePostComponent = ({ onPostCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://bkc-dt1n.onrender.com";

  /* -------------------- MEDIA CHANGE -------------------- */
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return alert("Only images or videos allowed.");
    }
    if (file.size > 8 * 1024 * 1024) {
      return alert("Max 8MB allowed.");
    }

    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  /* -------------------- UPLOAD TO BACKEND -> CLOUDINARY -------------------- */
  const uploadToServer = async (file) => {

    // ⚠ FIX 1: Prevent calling /upload if no media selected
    if (!file) {
      console.log("⚠ No media selected → skipping upload");
      return "";
    }

    const formData = new FormData();
    formData.append("media", file);

    const { data } = await axios.post(`${BACKEND_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },   // ⚠ FIX 2
      withCredentials: true,
    });

    return data.url; // Cloudinary secure_url
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() && !content.trim()) {
      return alert("Please write something.");
    }

    try {
      setLoading(true);

      let mediaUrl = "";

      // ⚠ FIX 3: Only upload when media actually exists
      if (media) {
        console.log("📤 Uploading media to backend...");
        mediaUrl = await uploadToServer(media);
        console.log("✅ Uploaded:", mediaUrl);
      }

      const payload = {
        title,
        subtitle,
        content,
        mediaUrl,
      };

      console.log("📤 Sending post to backend:", payload);

      const { data } = await axios.post(`${BACKEND_URL}/posts`, payload, {
        withCredentials: true,
      });

      alert("✅ Post published!");
      onPostCreated && onPostCreated(data.post);

      // Reset
      setTitle("");
      setSubtitle("");
      setContent("");
      setMedia(null);
      setMediaPreview(null);
      onClose && onClose();
    } catch (err) {
      console.error("❌ POST ERROR:", err.response || err);
      alert(err.response?.data?.message || "Failed to post.");
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

      <input
        type="text"
        placeholder="Title (optional)"
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
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-3 border rounded-xl"
      />

      <div>
        <label className="font-medium mb-1">Attach Image or Video:</label>
        <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />

        {mediaPreview && (
          <div className="mt-3 rounded-xl overflow-hidden border">
            {media?.type?.startsWith("video/") ? (
              <video src={mediaPreview} controls className="w-full max-h-64" />
            ) : (
              <img src={mediaPreview} className="w-full max-h-64" alt="preview" />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-lg"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-green-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </motion.form>
  );
};

export default CreatePostComponent;
