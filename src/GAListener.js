import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageview } from "./ga"; // agar aapne ga.js banaya hai

function GAListener() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname); // Har route change pe GA ko notify kare
  }, [location]);

  return null;
}

export default GAListener;
