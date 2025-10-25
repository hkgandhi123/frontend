import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const status = await isAuthenticated();
      setAuth(status);
    };
    checkAuth();
  }, []);

  if (auth === null)
    return <p className="text-center mt-10">Checking authentication...</p>;

  if (!auth)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}
