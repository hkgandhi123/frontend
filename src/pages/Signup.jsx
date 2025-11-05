import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { handleSignup } = useUserContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [isUnique, setIsUnique] = useState(true);

  // 🔹 Username uniqueness check
  const checkUsername = async (username) => {
    if (!username.trim()) return;
    setChecking(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/check-username?username=${username}`
      );
      const data = await res.json();

      if (data.exists) {
        setIsUnique(false);
        let suggestionText = "";
        if (data.suggestions?.length > 0) {
          suggestionText = `Try: ${data.suggestions.join(", ")}`;
        }
        setError(`❌ ${data.message}. ${suggestionText}`);
      } else {
        setIsUnique(true);
      }
    } catch (err) {
      setError("Error checking username. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isUnique) {
      setError("❌ Please choose another username");
      return;
    }

    const res = await handleSignup({
      username,
      email: emailOrPhone,
      password,
    });

    if (res.success) navigate("/");
    else setError(res.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-700 via-blue-700 to-black px-4 py-8">
      {/* Top Illustration */}
      <div className="flex flex-col items-center mb-6">
        

        {/* 🔹 Make image wider (left-right bigger) */}
        <img
          src="/singupimg.png.jpg"
          alt="Signup"
          className="w-60 sm:w-70 md:w-80 h-auto object-contain"
        />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center leading-tight mb-4">
          Create New <br /> Account
        </h1>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl space-y-3 w-full max-w-sm"
      >
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Username */}
        <div className="w-full">
          <label className="text-gray-200 text-sm mb-1 block">Username</label>
          <input
            type="text"
            placeholder="Choose a unique username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => checkUsername(username)}
            className={`w-full p-2 rounded-xl bg-gray-300 text-gray-900 focus:outline-none text-base sm:text-sm ${
              !isUnique ? "border-2 border-red-500" : ""
            }`}
            required
          />
          {checking && (
            <p className="text-blue-300 text-xs mt-1">Checking username...</p>
          )}
          {!checking && !isUnique && (
            <p className="text-red-400 text-xs mt-1">Username already taken</p>
          )}
          {!checking && isUnique && username && (
            <p className="text-green-400 text-xs mt-1">
              Username available ✅
            </p>
          )}
        </div>

        {/* Email or Phone */}
        <div className="w-full">
          <label className="text-gray-200 text-sm mb-1 block">
            Email or Phone
          </label>
          <input
            type="text"
            placeholder="Enter your email or phone number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-300 text-gray-900 focus:outline-none text-base sm:text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label className="text-gray-200 text-sm mb-1 block">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-300 text-gray-900 focus:outline-none text-base sm:text-sm"
            required
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition text-base sm:text-sm"
        >
          Sign Up
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
          Pride to be Indian
        </p>
      </form>
    </div>
  );
};

export default Signup;
