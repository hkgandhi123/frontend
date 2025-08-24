import { useEffect, useState } from "react";
import axios from "axios";

export default function Stories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get("/api/stories").then(res => setStories(res.data));
  }, []);

  return (
    <div className="flex space-x-3 overflow-x-auto p-2 border-b">
      {stories.map((story) => (
        <div key={story._id} className="flex flex-col items-center">
          <img
            src={story.user.profilePic}
            alt="story"
            className="w-16 h-16 rounded-full border-2 border-pink-500"
          />
          <p className="text-xs">{story.user.username}</p>
        </div>
      ))}
    </div>
  );
}
