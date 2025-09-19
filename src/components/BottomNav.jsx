import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaPlusSquare, FaUser } from "react-icons/fa";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg flex justify-around py-2 z-50">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-black" : "text-gray-500"
          }`
        }
      >
        <FaHome size={22} />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-black" : "text-gray-500"
          }`
        }
      >
        <FaSearch size={22} />
        <span className="text-xs">Search</span>
      </NavLink>

      <NavLink
        to="/create"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-black" : "text-gray-500"
          }`
        }
      >
        <FaPlusSquare size={22} />
        <span className="text-xs">Create</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-black" : "text-gray-500"
          }`
        }
      >
        <FaUser size={22} />
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
