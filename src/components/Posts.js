import React, { useEffect, useState } from "react";
import axios from "axios";

function Posts() {
  const [posts, setPosts] = useState([]);
  const backendURL = "https://bkc-dt1n.onrender.com"; // backend URL

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // ✅ withCredentials true for httpOnly cookie
        const { data } = await axios.get(`${backendURL}/posts/my`, {
          withCredentials: true,
        });
        setPosts(data);
      } catch (err) {
        console.error("❌ Error fetching posts:", err.response?.data || err.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available 📷</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="mb-4 border rounded p-2">
            <h3 className="font-semibold">{post.caption}</h3>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="w-64 h-64 object-cover mt-2 rounded"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Posts;
