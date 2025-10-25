import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { handleLogin } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await handleLogin({ email, password });
      if (res.success) navigate("/"); // login success → home
      else setError(res.message || "Login failed");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-black via-blue-900 to-emerald-700 px-6">
      <div className="w-full max-w-sm text-center text-white">
        {/* Avatar / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-white/10 rounded-full flex justify-center items-center text-6xl">
            👤
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6">Login to Your Account</h2>

        {/* Error message */}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Login Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="text-left">
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
            />
          </div>

          <div className="text-left">
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-5 text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-white font-semibold underline">
            Sign Up
          </Link>
        </p>

        {/* Footer text */}
        <p className="mt-8 text-sm text-gray-300 tracking-wide">
          Pride to be Indian 🇮🇳
        </p>
      </div>
    </div>
  );
};

export default Login;
