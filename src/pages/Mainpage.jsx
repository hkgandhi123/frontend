import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard"; // ✅ sahi path
import { getPosts } from "../api"; // ya jaha se aap posts fetch karte ho
import { IoArrowBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

const Mainpage = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  // 🔄 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("❌ Error loading posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900">
      {/* 🌆 Static Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-gray-500/30 bg-no-repeat z-0"
      ></div>

      {/* 🏠 Header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gray-800/90 backdrop-blur-sm">
        {/* Left: Back Arrow */}
        <button className="text-white text-2xl">
          <IoArrowBack />
        </button>

        {/* Middle: Search Input */}
        <div className="flex items-center flex-1 mx-4 bg-gray-700/60 rounded-full px-3 py-1">
          <FiSearch className="text-white text-lg mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-white w-full placeholder-white/60"
          />
        </div>

        {/* Right: Three Dots */}
        <button className="text-white text-2xl">
          <BsThreeDotsVertical />
        </button>
      </div>

      {/* 🧱 Scrollable Posts */}
      <div className="relative z-10 pt-16 h-full overflow-y-auto scrollbar-hide p-4 space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-white/80 mt-10 text-lg">
            Loading... 😶
          </p>
        )}
      </div>
    </div>
  );
};

export default Mainpage;
