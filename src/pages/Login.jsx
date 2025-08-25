import React, { useState } from "react";
import { login } from "../services/authService";

function Login() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      console.log("Login success:", data);
      localStorage.setItem("token", data.token); // ✅ token save
    } catch (err) {
      setError(err.message || "Login error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="usernameOrEmail"
        placeholder="Username or Email"
        value={form.usernameOrEmail}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default Login;
