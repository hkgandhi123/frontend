import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/UserContext";
import './index.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_ID;

if (!GOOGLE_CLIENT_ID) console.error("❌ REACT_APP_GOOGLE_CLIENT_ID is undefined!");
if (!GA_MEASUREMENT_ID) console.error("❌ REACT_APP_GA_ID is undefined!");

// Initialize GA script
const initGA = () => {
  if (!GA_MEASUREMENT_ID) return;

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
  `;
  document.head.appendChild(script2);
};

initGA();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <UserProvider>
        <App /> {/* App.js me GAListener component hoga */}
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
