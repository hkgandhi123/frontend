import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { handleLogin, handleGoogleLogin } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Google response handler
  const handleGoogleResponse = async (cred) => {
    const token = cred.credential;

    try {
      const res = await handleGoogleLogin(token);
      if (res.success) navigate("/");
      else setError("Google login failed ❌");
    } catch (err) {
      console.log(err);
      setError("Google login error");
    }
  };

  // ------------------ VALIDATION ADDED VERSION ------------------

const onSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Email / phone validation
  if (!email.trim()) {
    return setError("Email or phone is required");
  }

  // Email Format Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!emailRegex.test(email) && !phoneRegex.test(email)) {
    return setError("Enter a valid email or 10-digit phone number");
  }

  // Password validation
  if (!password.trim()) {
    return setError("Password is required");
  }

  if (password.length < 6) {
    return setError("Password must be at least 6 characters");
  }

  try {
    const res = await handleLogin({ emailOrPhone: email, password });
    if (res.success) navigate("/");
    else setError(res.message || "Login failed");
  } catch (err) {
    setError(err.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-black via-blue-900 to-emerald-700 px-6">
      <div className="w-full max-w-sm text-center text-white">

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-white/10 rounded-full flex justify-center items-center text-6xl">
            👤
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Login to Your Account</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Normal Login Form */}
        <form
          onSubmit={onSubmit}
          className="bg-transparent backdrop-blur-lg rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="text-left">
            <label className="block text-gray-300 text-sm mb-1">Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Login
          </button>
        </form>

        {/* ✅ Google Login Button */}
        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleResponse}
            onError={() => setError("Google Login Failed ❌")}
          />
        </div>

        <p className="mt-5 text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-white font-semibold underline">
            Sign Up
          </Link>
        </p>

        <div className="mt-2 flex justify-center items-center space-x-2 bg-gradient-to-r from-orange-400 via-white to-green-600 rounded-lg px-3 py-1 w-max mx-auto shadow-md">
          <span className="text-black font-semibold text-sm">Pride to be Indian</span>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
            alt="India"
            className="w-5 h-5"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
