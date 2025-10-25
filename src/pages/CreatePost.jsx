import React, { useState } from "react";
import { createPost, resolveURL } from "../api";
import { useUserContext } from "../context/UserContext";

const CreatePost = ({ onClose, type = "post" }) => {
  const { addNewPost } = useUserContext();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preview image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image first ❌");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile); // ✅ must match backend field name
      formData.append("caption", caption);
      formData.append("type", type);

      // Call backend API
      const res = await createPost(formData);

      // Backend should return { post: {...} }
      if (!res?.post) throw new Error("Post creation failed");

      // Resolve URLs for frontend display
      const newPost = {
        ...res.post,
        type,
        image: resolveURL(res.post.image),
        user: {
          ...res.post.user,
          profilePic: res.post.user?.profilePic
            ? resolveURL(res.post.user.profilePic)
            : "/default-avatar.png",
        },
      };

      // Update global state
      addNewPost(newPost, type);

      // Reset form
      setCaption("");
      setImageFile(null);
      setPreview(null);
      onClose?.();
    } catch (err) {
      console.error("❌ Post upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-center">
        Create {type === "reel" ? "Reel" : "Post"}
      </h2>

      {/* Image Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />

      {/* Image Preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-48 object-cover rounded"
        />
      )}

      {/* Caption Input */}
      <textarea
        placeholder="Write your thought..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white font-medium ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;
