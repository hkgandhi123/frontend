// src/App.jsx
import React, { createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUserContext } from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import UploadPost from "./components/UploadPost";
import Messages from "./pages/Messages";
import BottomNav from "./components/BottomNav";
import { io } from "socket.io-client";

// 🔹 Socket instance
const socket = io("https://bkc-dt1n.onrender.com", { withCredentials: true });

// 🔹 Socket context
export const SocketContext = createContext(null);

// 🔹 Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useUserContext();

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-lg">Loading...</p></div>;

  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/upload-post" element={<ProtectedRoute><UploadPost /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <AppRoutes />
          {/* BottomNav always rendered, but only visible for authenticated users on small screens */}
          <BottomNav />
        </BrowserRouter>
      </SocketContext.Provider>
    </UserProvider>
  );
}

export default App;
