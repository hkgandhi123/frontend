import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { resolveURLWithCacheBust } from "../utils/resolveURL";

const HomeHeader = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ✅ Scroll Hide / Show Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ✅ Safe Profile Image
  const getProfilePic = () => {
    if (!user?.profilePic) return "/default-avatar.png";
    try {
      return resolveURLWithCacheBust(user.profilePic);
    } catch {
      return "/default-avatar.png";
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 
      bg-black/70 backdrop-blur-md border-b border-gray-700
      text-white shadow-lg
      flex justify-between items-center px-4 
      transition-transform duration-500 ease-in-out 
      ${showHeader ? "translate-y-0" : "-translate-y-full"} 
      h-12 sm:h-14 z-50`}
    >
      {/* 👤 Profile Picture */}
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/profile/me");
        }}
      >
        <img
          src={getProfilePic()}
          alt={user?.username || "Profile"}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/70 shadow-sm"
        />
      </div>

    <h1 class="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
  HitBit
</h1>


      {/* 🔍 Search + ❤️ Notifications + ✉️ Messages */}
      <div className="flex space-x-5 text-2xl items-center">
        <LuSearch
          className="cursor-pointer hover:scale-110 transition-transform text-white"
          onClick={() => navigate("/search")}
        />
        <AiOutlineHeart
          className="cursor-pointer hover:scale-110 transition-transform text-white"
          onClick={() => navigate("/notifications")}
        />
        <FiSend
          className="cursor-pointer hover:scale-110 transition-transform text-white"
          onClick={() => navigate("/messages")}
        />
      </div>
    </div>
  );
};

export default HomeHeader;
