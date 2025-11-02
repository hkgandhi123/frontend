import React, { useState } from "react";
import { createPost } from "../api";

const CreatePostModal = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption && !media) return alert("Write an article or attach media!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (media) formData.append("media", media); // Image or video

      // 🔥 Send to backend API (Cloudinary upload handled there)
      const post = await createPost(formData);

      // Reset UI
      setCaption("");
      setMedia(null);
      setPreview(null);

      // Send new post to parent (for live update)
      onPostCreated && onPostCreated(post);

      alert("✅ Post created successfully!");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          placeholder="Write your article or thought..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />

        {/* Media upload (optional) */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="text-sm text-gray-700"
        />

        {/* Preview */}
        {preview && (
          <>
            {media.type.startsWith("video") ? (
              <video
                src={preview}
                controls
                className="w-full rounded-lg max-h-64 object-cover"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg max-h-64 object-cover"
              />
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostModal;
