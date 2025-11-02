import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { updateProfile } from "../api";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateUserContext } = useUserContext();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(
    user?.profilePic || "/default-avatar.png"
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ------------------ FILE CHANGE HANDLER ------------------ */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setPreview(URL.createObjectURL(file)); // instant preview
  };

  /* ------------------ SUBMIT HANDLER ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first!");

    setLoading(true);
    try {
      const formData = new FormData();
      if (username.trim()) formData.append("username", username);
      if (bio.trim()) formData.append("bio", bio);
      if (profilePic) formData.append("profilePic", profilePic);

      console.log("📤 Uploading profile update...");

      const updatedUser = await updateProfile(formData);
      console.log("✅ Updated user:", updatedUser);

      // Handle Cloudinary or backend URL
      const newProfilePic =
        updatedUser?.profilePic?.startsWith("http")
          ? updatedUser.profilePic
          : updatedUser?.profilePic
          ? `${
              import.meta.env.VITE_BACKEND_URL ||
              "https://bkc-dt1n.onrender.com"
            }${updatedUser.profilePic}`
          : "/default-avatar.png";

      // Cache bust to ensure instant update
      const cacheBustedPic = `${newProfilePic}?v=${Date.now()}`;

      // Update global user context
      updateUserContext({
        ...user,
        ...updatedUser,
        profilePic: cacheBustedPic,
      });

      // Update preview instantly
      setPreview(cacheBustedPic);

      alert("✅ Profile updated successfully!");
      navigate("/profile/me", { state: { refreshed: true } });
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 rounded"
        />

        {/* Bio */}
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio / Thought"
          className="border p-2 rounded"
        />

        {/* Preview */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        {/* File Upload */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
