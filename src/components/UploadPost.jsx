import React, { useState } from "react";
import axios from "axios";

function UploadPost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Backend URL (local or deployed)
  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://bkc-dt1n.onrender.com";

  // 🔹 Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      alert("❌ Please enter a caption");
      return;
    }

    if (!media) {
      alert("❌ Please select an image or video");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", media); // ✅ backend expects "file" (not "media")

    try {
      setLoading(true);

      // ✅ Token from localStorage or cookie (Render uses cookies)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login before creating a post 🔒");
        return;
      }

      const res = await axios.post(`${BACKEND_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ JWT token header
        },
        withCredentials: true, // ✅ important for cookies
      });

      console.log("✅ Post uploaded:", res.data);
      alert("✅ Post uploaded successfully!");

      // Reset form
      setCaption("");
      setMedia(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      alert(
        `❌ Upload failed: ${
          err.response?.data?.message || "Server error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Upload a New Post
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* File upload */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="border p-2 rounded-lg"
        />

        {/* Preview */}
        {previewUrl && (
          <div className="relative">
            {media?.type?.startsWith("image") ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg border w-full"
              />
            ) : (
              <video
                controls
                src={previewUrl}
                className="rounded-lg border w-full"
              />
            )}
          </div>
        )}

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border p-2 rounded-lg resize-none h-24"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </form>
    </div>
  );
}

export default UploadPost;
