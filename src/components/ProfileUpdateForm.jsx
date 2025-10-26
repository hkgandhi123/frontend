import React, { useState, useEffect } from "react";
import { updateProfile } from "../services/authService";
import { useUserContext } from "../context/UserContext";
import { resolveURL } from "../utils/resolveURL";

export default function ProfileUpdateForm({ profile, setProfile }) {
  const { updateUserContext } = useUserContext();
  const [formData, setFormData] = useState({
    username: profile.username || "",
    email: profile.email || "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(resolveURL(profile.profilePic) || null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Update preview when profilePic changes
  useEffect(() => {
    if (profile.profilePic) {
      setPreview(resolveURL(profile.profilePic) + `?t=${Date.now()}`);
    }
  }, [profile.profilePic]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      // Temporary preview for selected image
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (file) data.append("profilePic", file);

      const res = await updateProfile(data);

      // ✅ Update global user context
      updateUserContext(res.user);

      // ✅ Update local profile state with fresh image URL
      setProfile({
        ...res.user,
        profilePic: resolveURL(res.user.profilePic) + `?t=${Date.now()}`,
      });

      setMessage("✅ Profile updated successfully!");
      setFile(null);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 items-center p-4 bg-gray-50 rounded-lg shadow-md max-w-sm mx-auto"
    >
      {message && (
        <p
          className={`text-sm font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Profile Image Preview */}
      {preview && (
        <img
          key={preview} // 🔑 Forces React to refresh image
          src={preview}
          alt="Profile preview"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="text-sm text-gray-600 border p-2 rounded w-full"
      />

      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="border p-2 rounded w-full"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
