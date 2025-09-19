import React, { useState } from "react";
import axios from "axios";

function UploadPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image ❌");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://bkc-dt1n.onrender.com/posts/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("✅ Post uploaded");
      console.log(res.data);
      setCaption("");
      setImage(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Upload New Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border p-2 rounded"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-500 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </form>
    </div>
  );
}

export default UploadPost;
