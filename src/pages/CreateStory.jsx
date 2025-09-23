import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const CreateStory = () => {
  const { backendURL } = useUserContext();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select an image/video");

    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    try {
      await axios.post(`${backendURL}/stories`, formData, { withCredentials: true });
      alert("Story uploaded ✅");
      setFile(null);
      setCaption("");
    } catch (err) {
      console.error(err);
      alert("Failed to upload story ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-80">
      <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        className="border p-1 w-full mt-2"
      />
      <button type="submit" className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Post Story</button>
    </form>
  );
};

export default CreateStory;
