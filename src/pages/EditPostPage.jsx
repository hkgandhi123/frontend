import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../api";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPostById(id);
      setFormData({ title: post.title, content: post.content });
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePost(id, formData);
    alert("✔️ Post updated successfully");
    navigate(`/post/${id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditPostPage;
