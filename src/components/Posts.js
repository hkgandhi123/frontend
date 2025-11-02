import React, { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const backendURL = "https://bkc-dt1n.onrender.com"; // ✅ your backend URL

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/posts`, {
          withCredentials: true,
        });

        // handle both { posts: [] } or direct []
        setPosts(data?.posts || data || []);
      } catch (err) {
        console.error(
          "❌ Error fetching posts:",
          err.response?.data || err.message
        );
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📜 Latest Articles</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    post?.user?.profilePic ||
                    "/default-avatar.png" // ✅ fallback if null
                  }
                  alt={post?.user?.username || "Unknown User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-semibold text-gray-700">
                  {post?.user?.username || "Anonymous"}
                </p>
              </div>

              {/* Article Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {post.title || "Untitled Post"}
              </h3>

              {/* Content */}
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                {post.content || "No content available."}
              </p>

              {/* Optional Media */}
              {post.media && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  {post.mediaType === "video" ? (
                    <video
                      controls
                      className="w-full max-h-80 rounded-lg"
                      src={post.media}
                    ></video>
                  ) : (
                    <img
                      src={post.media}
                      alt="post"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-sm text-gray-500 mt-2">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "Unknown date"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
