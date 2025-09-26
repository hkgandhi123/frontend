import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { createPost } from "../api"; // use the API helper instead of raw axios
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { posts, setPosts } = useUserContext();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !caption) return alert("Add an image or caption ❌");
    setLoading(true);

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      formData.append("caption", caption);

      const res = await createPost(formData); // backend uploads to Cloudinary

      if (res.post) {
        setPosts([res.post, ...posts]); // instantly add new post to feed
        navigate("/"); // redirect to home after posting
      } else {
        alert("Post upload failed ❌");
      }
    } catch (err) {
      console.error("Post upload error:", err);
      alert("Failed to upload post ❌");
    } finally {
      setLoading(false);
      setCaption("");
      setImageFile(null);
      setPreview(null);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-11/12 sm:w-96 p-4 border rounded shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Create Post</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded mb-3"
          />
        )}

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
    </div>
  );
};

export default CreatePost;
