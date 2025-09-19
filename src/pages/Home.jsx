// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://bkc-dt1n.onrender.com/posts", {
        withCredentials: true,
      });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error("❌ Feed fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading feed...</p>;
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="home-feed" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {posts.map((post) => (
        <div
          key={post._id}
          className="post-card"
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            margin: "20px 0",
            padding: "10px",
            backgroundColor: "#fff",
          }}
        >
          {/* User Info */}
          <div
            className="post-user"
            style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
          >
            <img
              src={
                post.user.profilePic
                  ? `https://bkc-dt1n.onrender.com${post.user.profilePic}`
                  : "https://via.placeholder.com/40"
              }
              alt={post.user.username}
              style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
            />
            <strong>{post.user.username}</strong>
          </div>

          {/* Post Image */}
          <div className="post-image" style={{ marginBottom: "10px" }}>
            <img
              src={`https://bkc-dt1n.onrender.com${post.image}`}
              alt="post"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="post-caption">
              <p>{post.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
