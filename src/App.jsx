import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUserContext } from "./context/UserContext";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import UploadPost from "./components/UploadPost";
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
      <Route path="/" element={<Home />} />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/" />}
      />
      <Route
        path="/edit-profile"
        element={user ? <EditProfile /> : <Navigate to="/" />}
      />
      <Route
        path="/upload-post"
        element={user ? <UploadPost /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
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
