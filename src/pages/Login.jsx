import React, { useState } from "react";
import { login } from "../services/authService";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      alert("Login successful!");
    } catch {
      alert("Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
