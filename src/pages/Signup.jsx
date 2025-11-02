import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { handleSignup } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await handleSignup({ username: name, email, password });
    if (res.success) navigate("/");
    else setError(res.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-700 via-blue-700 to-black px-4 py-8">
      {/* Top Illustration */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/singupimg.png.jpg" // 👈 Replace with your image path
          alt="Signup"
          className="w-40 sm:w-40 md:w-48 h-auto object-contain mb-4"
          
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center leading-tight">
          Create new <br /> Account
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl space-y-3"
        
      >
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Name */}
        <div className="w-full">
          <label className="text-gray-200 text-sm mb-1 block">NAME</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-300 text-gray-900 focus:outline-none text-base sm:text-sm"
            required
          />
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="text-gray-200 text-sm mb-1 block">EMAIL</label>
          <input
            type="email"
            placeholder="hello@reallygreatsite.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-300 text-gray-900 focus:outline-none text-base sm:text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label className="text-gray-200 text-sm mb-1 block">PASSWORD</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-300 text-gray-900 focus:outline-none text-base sm:text-sm"
            required
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition text-base sm:text-sm"
        >
          sign up
        </button>

        {/* Login link */}
        <p className="text-white text-sm mt-1 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-300 underline hover:text-blue-400"
          >
            Login
          </Link>
        </p>

        {/* Pride Text */}
        <p className="text-white text-sm mt-2 text-center">
          pride to be indian
        </p>

      </form>
    </div>
  );
};

export default Signup;
