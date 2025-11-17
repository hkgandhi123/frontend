import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const TrendingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL (use your deployed backend route /trending)
  const BASE_URL = "https://bkc-dt1n.onrender.com";

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/trending`);
        let todayPosts = res.data || [];

        // Calculate trend score
        todayPosts = todayPosts.map((post) => ({
          ...post,
          trendScore:
            (post.votes || 0) +
            (post.views || 0) * 0.5 +
            (post.reposts || 0) * 1,
        }));

        // Sort descending by trend score
        todayPosts.sort((a, b) => b.trendScore - a.trendScore);

        // Take top 30%
        const topCount = Math.ceil(todayPosts.length * 0.3);
        const trendingPosts = todayPosts.slice(0, topCount);

        setPosts(trendingPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending posts:", err);
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );

  const getBadge = (index) => {
    switch (index) {
      case 0:
        return { text: "🔥 #1", bg: "bg-yellow-400", textColor: "text-black" };
      case 1:
        return { text: "⭐ #2", bg: "bg-gray-300", textColor: "text-black" };
      case 2:
        return { text: "🌟 #3", bg: "bg-orange-400", textColor: "text-black" };
      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-fixed bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/path-to-your-background.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 p-4 max-w-6xl mx-auto space-y-6 overflow-y-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center">
          Trending Today
        </h1>

        {posts.length === 0 ? (
          <div className="text-center text-white text-lg">
            No trending posts today!
          </div>
        ) : (
          posts.map((post, index) => {
            const badge = getBadge(index);
            return (
              <div
                key={post._id}
                className={`relative transform transition duration-500 hover:scale-[1.02] ${
                  badge
                    ? "border-4 shadow-2xl rounded-xl animate-pulse hover:animate-none"
                    : "rounded-lg shadow-md"
                }`}
              >
                {badge && (
                  <div
                    className={`absolute top-2 left-2 px-3 py-1 rounded-md font-bold text-sm z-10 ${badge.bg} ${badge.textColor} shadow-lg`}
                  >
                    {badge.text}
                  </div>
                )}
                <PostCard post={post} />
              </div>
            );
          })
        )}
      </div>

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-left-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default TrendingPage;
