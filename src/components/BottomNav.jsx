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
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around border-t bg-white p-2 sm:hidden">
      <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}>
        <FaHome size={24} />
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}>
        <FaSearch size={24} />
      </NavLink>
      <NavLink to="/create" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}>
        <FaPlusSquare size={24} />
      </NavLink>
      <NavLink to="/reels" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}>
        <ReelsIcon size={24} />
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}>
        <FaUser size={24} />
      </NavLink>
    </div>
  );
};

export default BottomNav;
