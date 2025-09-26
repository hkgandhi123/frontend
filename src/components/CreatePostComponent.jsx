import React, { useState } from "react";
import { createPost } from "../api";

const CreatePostComponent = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !image) return alert("Add caption or image");

    setLoading(true);
    try {
      const post = await createPost({ caption, image });
      setCaption("");
      setImage(null);
      onPostCreated && onPostCreated(post); // parent component ko update bhej do
      alert("Post created!");
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {image && <p>Selected: {image.name}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostComponent;
