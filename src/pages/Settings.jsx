import React, { useState } from "react";
import { FaMoon, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // 🌙 Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-black");
    document.body.classList.toggle("text-white");
  };

  // 🚪 Logout (placeholder)
  const handleLogout = () => {
    alert("Logged out ✅");
    // TODO: add logout logic later
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 p-4">
      {/* 🔙 Header */}
      <div className="flex items-center gap-3 mb-6">
        <IoArrowBack
          className="text-2xl cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate(-1)} // Go back to previous page
        />
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      {/* ⚙️ Settings Options */}
      <div className="space-y-3">
        <button className="w-full flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <FaUserCog className="mr-3 text-lg" /> Account Settings
        </button>

        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FaMoon className="mr-3 text-lg" />{" "}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 border border-red-500 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <FaSignOutAlt className="mr-3 text-lg" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
