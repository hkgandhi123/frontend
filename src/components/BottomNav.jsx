// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaPlusSquare, FaUser } from "react-icons/fa";

// Custom Reels Icon
const ReelsIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M2 3h20v18H2V3zm4 0l3 6h3l-3-6H6zm7 0l3 6h3l-3-6h-3zM4 9v10h16V9H4zm6 2.5v5l4.5-2.5L10 11.5z"/>
  </svg>
);

const BottomNav = () => {
  const links = [
    { to: "/", icon: <FaHome size={24} />, label: "Home" },
    { to: "/search", icon: <FaSearch size={24} />, label: "Search" },
    { to: "/create", icon: <FaPlusSquare size={24} />, label: "Create" },
    { to: "/reels", icon: <ReelsIcon size={24} />, label: "Reels" },
    { to: "/profile", icon: <FaUser size={24} />, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full flex justify-around border-t bg-white p-2 sm:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-sm ${isActive ? "text-blue-500" : "text-gray-500"}`
            }
          >
            {link.icon}
            <span className="text-xs mt-1">{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden sm:flex fixed top-0 left-0 w-full justify-center border-b bg-white p-2 z-50">
        <div className="flex space-x-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 ${
                  isActive ? "text-blue-500 font-semibold" : "text-gray-600"
                }`
              }
            >
              {link.icon}
              <span className="hidden md:inline">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomNav;

