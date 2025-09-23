import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUserContext } from "./context/UserContext";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅ Signup import
import CreatePost from "./pages/CreatePost";
import UploadPost from "./components/UploadPost";
import Messages from "./pages/Messages";
import BottomNav from "./components/BottomNav";

function AppRoutes() {
  const { user, loading } = useUserContext();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />  {/* ✅ Signup route */}

      <Route path="/" element={<Home />} />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" />}  // redirect to login if not logged in
      />
      <Route
        path="/edit-profile"
        element={user ? <EditProfile /> : <Navigate to="/login" />}
      />
      <Route
        path="/upload-post"
        element={user ? <UploadPost /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
        <BottomNav />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;