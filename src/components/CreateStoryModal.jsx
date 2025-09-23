import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const CreateStoryModal = ({ isOpen, onClose, onStoryCreated }) => {
  const { backendURL } = useUserContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image/video first ❌");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("media", file);

      const res = await axios.post(`${backendURL}/stories`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Story uploaded ✅");
        onStoryCreated(); // Refresh stories
        onClose(); // Close modal
      } else {
        alert("Failed to upload story ❌");
      }
    } catch (err) {
      console.error("Story upload error:", err);
      alert("Error uploading story ❌");
    } finally {
      setLoading(false);
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-96">
        <h2 className="text-lg font-bold mb-4 text-center">Create Story</h2>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />

        {preview && (
          <div className="mb-4">
            {file.type.startsWith("video") ? (
              <video
                src={preview}
                className="w-full h-48 object-cover rounded"
                controls
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
