import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard"; // ✅ sahi path
import { getPosts } from "../api"; // ya jaha se aap posts fetch karte ho

const Mainpage = () => {
  const [posts, setPosts] = useState([]);

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
    <div className="relative h-screen overflow-hidden">
      {/* 🌆 Static Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
          filter: "brightness(0.6)",
        }}
      ></div>

      {/* 🧱 Scrollable Posts */}
      <div className="relative z-10 h-full overflow-y-auto scrollbar-hide p-4 space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-white/80 mt-10 text-lg">
            No posts yet 😶
          </p>
        )}
      </div>
    </div>
  );
};

export default Mainpage;
