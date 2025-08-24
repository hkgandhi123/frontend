import { useEffect, useState } from "react";
import axios from "axios";

export default function Explore() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/posts/explore").then(res => setPosts(res.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-1 p-2">
      {posts.map(p => (
        <img key={p._id} src={p.imageUrl} alt="post" className="w-full h-40 object-cover" />
      ))}
    </div>
  );
}
