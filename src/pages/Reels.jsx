import React from "react";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft } from "react-icons/lu";

const Reels = () => {
  const navigate = useNavigate();

  // Placeholder reels (just colored divs for now)
  const reels = Array(5).fill(0);

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-y-auto">
      {/* Top bar with back button */}
      <div className="fixed top-0 left-0 w-full flex items-center p-4 bg-black/80 backdrop-blur-sm z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:text-gray-300 transition"
        >
          <LuChevronLeft size={24} className="mr-2" />
          Back
        </button>
      </div>

      {/* Reel placeholders */}
      <div className="pt-20 space-y-4">
        {reels.map((_, index) => (
          <div
            key={index}
            className="relative w-full h-screen bg-gray-900 flex items-center justify-center"
          >
            {/* Coming Soon overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <h1 className="text-5xl font-bold mb-4">🎬 Coming Soon 🎬</h1>
              <p className="text-xl text-gray-300">Reels feature is under development</p>
            </div>

            {/* Placeholder content (optional visual) */}
            <div className="w-40 h-80 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
