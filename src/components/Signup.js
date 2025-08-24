import React, { useState } from "react";
import API from "../api";

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/signup", formData);
      setMsg("Signup successful! Please login.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Signup</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default Signup;
