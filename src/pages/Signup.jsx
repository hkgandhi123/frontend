import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const { handleSignup, handleGoogleLogin } = useUserContext();
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

  // ✅ GOOGLE SIGNUP HANDLER
  const handleGoogleSuccess = async (cred) => {
    const token = cred.credential;
    const res = await handleGoogleLogin(token);

    if (res.success) navigate("/");
    else setError("Google Signup Failed ❌");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-700 via-blue-700 to-black px-4 py-8">
      <h1 className="text-3xl sm:text-3xl font-bold text-white text-center leading-tight mb-4">
        Create New <br /> Account
      </h1>

      {/* FORM */}
      <form
        onSubmit={onSubmit}
        className="bg-transparent backdrop-blur-lg rounded-3xl p-10 shadow-2xl space-y-3 w-full max-w-sm"
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
            <p className="text-green-400 text-xs mt-1">Username available ✅</p>
          )}
        </div>

        {/* Email */}
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
            autoComplete="new-password"
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition text-base sm:text-sm"
        >
          Sign Up
        </button>

        {/* ✅ Google Signup Button */}
        <div className="flex justify-center mt-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed ❌")}
          />
        </div>

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

       <div className="mt-2 flex justify-center items-center space-x-2 bg-gradient-to-r from-orange-400 via-white to-green-600 rounded-lg px-3 py-1 w-max mx-auto shadow-md">
  <span className="text-black font-semibold text-sm">Pride to be Indian</span>
  <img
    src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
    alt="India"
    className="w-5 h-5"
  />
</div>

      </form>
    </div>
  );
};

export default Signup;
