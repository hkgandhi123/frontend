import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { updateProfile } from "../api";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateUserContext } = useUserContext();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          profilePic: data.user.profilePic + `?t=${Date.now()}`, // cache-busting
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
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
