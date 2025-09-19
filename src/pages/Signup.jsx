import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ username, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full p-3 border rounded"/>
          <input required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded"/>
          <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded"/>
          <button className="w-full p-3 bg-green-500 text-white rounded">Sign up</button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-500 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
