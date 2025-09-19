// src/components/ProfilePicUpload.jsx
import React, { useState } from "react";
import { uploadProfilePic } from "../services/authService";

const ProfilePicUpload = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file");
    setLoading(true);
    try {
      const res = await uploadProfilePic(file);
      alert("Profile pic updated!");
      if (onUploaded) onUploaded(res.profilePic);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="mt-4">
      {preview && <img src={preview} alt="preview" className="w-24 h-24 rounded-full mb-2 object-cover" />}
      <input type="file" accept="image/*" onChange={handleFile} />
      <button disabled={loading} className="ml-2 px-3 py-1 bg-green-500 text-white rounded">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default ProfilePicUpload;
