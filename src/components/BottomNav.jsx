import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuHouse,
  LuSquarePlus,
  LuClapperboard,
  LuChevronsUp,
  LuChevronsUpDown,
} from "react-icons/lu";
import { useUserContext } from "../context/UserContext";

const BottomNav = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  if (!user) return null;

  const iconSize = 28; // 🔥 Thicker & larger icons

  const links = [
    { to: "/", icon: <LuHouse size={iconSize} />, label: "Home" },
    {
      to: "/search",
      icon: <LuChevronsUpDown size={iconSize} />,
      label: "Search",
    },
    { to: "/create", icon: <LuSquarePlus size={iconSize} />, label: "Create" },
    { to: "/reels", icon: <LuClapperboard size={iconSize} />, label: "Reels" },
  ];

  return (
    <>
      {/* 📱 Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full flex justify-around items-center 
                      border-t border-gray-700 bg-black/70 backdrop-blur-md py-3 sm:hidden z-50 shadow-lg">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center transition-transform duration-200 ${
                isActive
                  ? "text-white scale-110 font-extrabold"
                  : "text-gray-400 hover:text-white hover:scale-105"
              }`
            }
          >
            {link.icon}
          </NavLink>
        ))}

        {/* 🔼 Profile Shortcut */}
        <div
          onClick={() => navigate("/profile/me")}
          className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
        >
          <LuChevronsUp size={iconSize + 2} />
        </div>
      </div>

      {/* 💻 Desktop Bottom Nav */}
      <div className="hidden sm:flex fixed bottom-0 left-0 w-full justify-center 
                      border-t border-gray-700 bg-black/70 backdrop-blur-md py-3 z-50 shadow-lg">
        <div className="flex items-center space-x-10">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center transition-transform duration-200 ${
                  isActive
                    ? "text-white scale-110 font-extrabold"
                    : "text-gray-400 hover:text-white hover:scale-105"
                }`
              }
            >
              {link.icon}
            </NavLink>
          ))}

          {/* 🔼 Profile Shortcut */}
          <div
            onClick={() => navigate("/profile/me")}
            className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
          >
            <LuChevronsUp size={iconSize + 2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
