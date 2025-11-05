import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaShieldAlt, FaLock, FaUserSecret } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 p-4">
      {/* 🔙 Header */}
      <div className="flex items-center gap-3 mb-6">
        <IoArrowBack
          className="text-2xl cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate(-1)} // Go back
        />
        <h2 className="text-xl font-semibold">Privacy</h2>
      </div>

      {/* 🔒 Privacy Options */}
      <div className="space-y-3">
        <button className="w-full flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <FaShieldAlt className="mr-3 text-lg" /> Privacy & Security
        </button>

        <button className="w-full flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <FaLock className="mr-3 text-lg" /> Change Password
        </button>

        <button className="w-full flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <FaUserSecret className="mr-3 text-lg" /> Private Account
        </button>
      </div>

      {/* ℹ️ Footer */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 text-center">
        Manage your data, password, and visibility preferences.
      </p>
    </div>
  );
};

export default Privacy;
