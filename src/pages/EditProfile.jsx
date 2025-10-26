import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { updateProfile } from "../api";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateUserContext } = useUserContext();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (profilePic) formData.append("profilePic", profilePic);

      const data = await updateProfile(formData);

      if (data.success) {
        updateUserContext({
          ...data.user,
          profilePic: data.user.profilePic + `?t=${Date.now()}`,
        });
        alert("Profile updated successfully ✅");
        navigate("/profile/me");
      }
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover mb-2 border"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 rounded"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
