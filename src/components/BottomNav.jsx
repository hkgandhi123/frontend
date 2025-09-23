import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaPlusSquare, FaHeart, FaUser } from "react-icons/fa";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around border-t bg-white p-2">
      <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}><FaHome size={24} /></NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}><FaSearch size={24} /></NavLink>
      <NavLink to="/create" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}><FaPlusSquare size={24} /></NavLink>
      <NavLink to="/notifications" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}><FaHeart size={24} /></NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-500"}><FaUser size={24} /></NavLink>
    </div>
  );
};

export default BottomNav;
