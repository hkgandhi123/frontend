import React, { useEffect, useState } from "react";
import API from "../api";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get("/api/posts");
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <h3>{post.caption}</h3>
            {post.imageUrl && <img src={post.imageUrl} alt="post" width="200" />}
          </div>
        ))
      )}
    </div>
  );
}

export default Posts;
