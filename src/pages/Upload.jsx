import React, { useState } from "react";
import { createPost } from "../api";
import { useUserContext } from "../context/UserContext";

const Upload = () => {
  const { addNewPost } = useUserContext();

  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("post"); // 'post' or 'reel'
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreview(URL.createObjectURL(file)); // Preview locally
    }
  };

  // Upload post
  const handleUpload = async () => {
    if (!mediaFile) return alert("Please select an image or video!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("file", mediaFile);
      formData.append("type", type);

      const post = await createPost(formData);

      // Add new post globally (UserContext)
      addNewPost(post, type);

      // Reset
      setCaption("");
      setMediaFile(null);
      setPreview(null);
      alert("Post uploaded successfully ✅");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Upload {type === "post" ? "Post" : "Reel"}
      </h1>

      {/* Type selector */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setType("post")}
          className={`px-4 py-2 rounded ${
            type === "post" ? "bg-blue-500 text-white" : "bg-white border"
          }`}
        >
          Post
        </button>
        <button
          onClick={() => setType("reel")}
          className={`px-4 py-2 rounded ${
            type === "reel" ? "bg-blue-500 text-white" : "bg-white border"
          }`}
        >
          Reel
        </button>
      </div>

      {/* Media input */}
      <input
        type="file"
        accept={type === "post" ? "image/*" : "video/*"}
        onChange={handleMediaChange}
        className="mb-4"
      />

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          {type === "post" ? (
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-96 object-contain"
            />
          ) : (
            <video controls src={preview} className="w-full max-h-96" />
          )}
        </div>
      )}

      {/* Caption */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        className="mb-4 w-full p-2 border rounded resize-none"
      />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-500"
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Upload;
