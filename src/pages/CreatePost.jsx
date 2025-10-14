import React, { useState } from "react";
import { createPost, resolveURL } from "../api";
import { useUserContext } from "../context/UserContext";

const CreatePost = ({ onClose, type = "post" }) => {
  const { addNewPost } = useUserContext();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image first ❌");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);
      formData.append("type", type);

      const res = await createPost(formData);
      if (!res.post) return alert("Failed to create post ❌");

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

      // Add post globally for Home + Profile
      addNewPost(newPost, type);

      // Reset
      setCaption("");
      setImageFile(null);
      setPreview(null);
      onClose?.();
    } catch (err) {
      console.error("❌ Post upload error:", err);
      alert(err.response?.data?.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Create {type === "reel" ? "Reel" : "Post"}
      </h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />
      {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded mb-3" />}

      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
      />

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
