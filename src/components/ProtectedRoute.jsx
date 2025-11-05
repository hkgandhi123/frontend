import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await isAuthenticated();
        setAuth(status);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  // 🕒 Show loading while checking auth
  if (auth === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  // 🚫 Not authenticated → redirect to login
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Authenticated → render page
  return children;
};

export default ProtectedRoute;
