import React, { useState } from "react";
import { updateProfile } from "../services/authService";

export default function ProfileUpdateForm({ profile, setProfile }) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    email: profile.email || "",
    profilePic: profile.profilePic || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData);
      setProfile(res.user);
      setMessage("✅ Profile updated successfully!");
    } catch {
      setMessage("❌ Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {message && <p className="text-green-500">{message}</p>}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="profilePic"
        value={formData.profilePic}
        onChange={handleChange}
        placeholder="Profile Picture URL"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
        Update Profile
      </button>
    </form>
  );
}
