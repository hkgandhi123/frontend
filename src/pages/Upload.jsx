// src/pages/Upload.jsx
import React, { useState } from "react";

const Upload = () => {
  const [media, setMedia] = useState(null);
  const [type, setType] = useState("post"); // 'post' or 'reel'
  const [caption, setCaption] = useState("");

  // Media select handler
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(URL.createObjectURL(file)); // Preview
    }
  };

  const handleUpload = () => {
    if (!media) {
      alert("Please select an image or video!");
      return;
    }
    // ✅ Here you can send 'media', 'type', 'caption' to backend API
    console.log({ media, type, caption });
    alert("Post uploaded! (Preview only, integrate backend to store)");
    setMedia(null);
    setCaption("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Upload {type === "post" ? "Post" : "Reel"}</h1>

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
      {media && (
        <div className="mb-4">
          {type === "post" ? (
            <img src={media} alt="preview" className="w-full max-h-96 object-contain" />
          ) : (
            <video controls src={media} className="w-full max-h-96" />
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
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default Upload;
