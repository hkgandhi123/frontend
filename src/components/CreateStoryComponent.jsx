import React, { useState } from "react";
import { createStory } from "../api";

const CreateStoryComponent = ({ onStoryCreated }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Select an image");

    setLoading(true);
    try {
      const story = await createStory({ image });
      setImage(null);
      onStoryCreated && onStoryCreated(story);
      alert("Story created!");
    } catch (err) {
      console.error(err);
      alert("Error creating story");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {image && <p>Selected: {image.name}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          {loading ? "Uploading..." : "Add Story"}
        </button>
      </form>
    </div>
  );
};

export default CreateStoryComponent;
