import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaPlusSquare, FaVideo } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";
import { resolveURLWithCacheBust } from "../utils/resolveURL";

const BottomNav = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  if (!user) return null;

  const links = [
    { to: "/", icon: <FaHome size={24} />, label: "Home" },
    { to: "/search", icon: <FaSearch size={24} />, label: "Search" },
    { to: "/create", icon: <FaPlusSquare size={24} />, label: "Create" },
    { to: "/reels", icon: <FaVideo size={24} />, label: "Reels" },
  ];

  const getProfilePic = () => resolveURLWithCacheBust(user.profilePic);

  return (
    <>
      {/* Mobile */}
      <div className="fixed bottom-0 left-0 w-full flex justify-around items-center border-t bg-white py-3 sm:hidden z-50">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? "text-black" : "text-gray-500"}`
            }
          >
            {link.icon}
          </NavLink>
        ))}
        <div
          onClick={() => navigate("/profile/me")}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            src={getProfilePic()}
            alt={user.username || "Profile"}
            className="w-6 h-6 rounded-full object-cover border"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex fixed bottom-0 left-0 w-full justify-center border-t bg-white py-3 z-50">
        <div className="flex items-center space-x-10">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center ${isActive ? "text-black" : "text-gray-500"}`
              }
            >
              {link.icon}
            </NavLink>
          ))}
          <div
            onClick={() => navigate("/profile/me")}
            className="flex flex-col items-center cursor-pointer"
          >
            <img
              src={getProfilePic()}
              alt={user.username || "Profile"}
              className="w-6 h-6 rounded-full object-cover border"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
