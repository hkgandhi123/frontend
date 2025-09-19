import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { updateProfile } from "../services/authService";

function EditProfile() {
  const { user, setUser } = useUserContext();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.profilePic ? `https://bkc-dt1n.onrender.com${user.profilePic}` : null
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ File select handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);

      // ⚡ backend me multer ka field match hona chahiye
      if (profilePicFile) formData.append("profilePic", profilePicFile); // ✅ match backend // <-- agar backend me upload.single("profilePic") hai

      const data = await updateProfile(formData);

      if (data?.user) {
        setUser(data.user); // context update
        navigate("/profile");
      } else {
        alert("Update failed, please try again ❌");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover mb-2 border-2 border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-gray-500"
          />
        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Bio */}
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-medium ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
