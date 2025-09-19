import React, { useState } from "react";
import { FaMoon, FaSignOutAlt, FaUserCog } from "react-icons/fa";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-black");
    document.body.classList.toggle("text-white");
  };

  const handleLogout = () => {
    alert("Logged out ✅");
    // TODO: logout logic
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Settings</h2>

      {/* Account Settings */}
      <div className="space-y-3">
        <button className="w-full flex items-center p-3 border rounded-md">
          <FaUserCog className="mr-2" /> Account Settings
        </button>

        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center p-3 border rounded-md"
        >
          <FaMoon className="mr-2" /> {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 border rounded-md text-red-500"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
