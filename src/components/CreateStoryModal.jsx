import React, { useState } from "react";
import { createStory } from "../api";

const CreateStoryModal = ({ isOpen, onClose, onStoryCreated }) => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image") && !file.type.startsWith("video")) return alert("Only images or videos are allowed!");
    setMedia(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media && !caption) return alert("Add image/video or text!");
    try {
      setLoading(true);
      await createStory({ media, caption });
      alert("✅ Story uploaded!");
      setMedia(null);
      setCaption("");
      onClose();
      onStoryCreated?.();
    } catch (err) {
      console.error("Story upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Failed to upload story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md flex flex-col space-y-4">
        <h2 className="text-lg font-semibold">Create Story</h2>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        {media && (
          <div className="mt-2">
            <p className="text-sm">Selected: {media.name}</p>
            {media.type.startsWith("image") && <img src={URL.createObjectURL(media)} alt="preview" className="w-32 h-32 object-cover rounded" />}
            {media.type.startsWith("video") && <video src={URL.createObjectURL(media)} className="w-32 h-32 rounded" controls />}
          </div>
        )}
        <input type="text" placeholder="Caption..." value={caption} onChange={(e) => setCaption(e.target.value)} className="border p-2 rounded" />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
            {loading ? "Uploading..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStoryModal;
