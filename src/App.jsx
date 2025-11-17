import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Mainpage from "./pages/Mainpage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./components/CreatePostComponent";
import Search from "./pages/Search";
import Reels from "./pages/Reels";
import EditProfile from "./pages/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Messages from "./pages/Messages";
import Notification from "./pages/Notifications";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import TrendingPage from "./pages/Trendingpage";
import EditPostPage from "./pages/EditPostPage";
import GAListener from "./GAListener";

function App() {
  return (
    <UserProvider>
      <Router>
        {/* 🔹 GA Listener to track all route changes */}
        <GAListener />

        <Routes>
          {/* ✅ Protected pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mainpage"
            element={
              <ProtectedRoute>
                <Mainpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <Reels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* ⚙️ Settings and Privacy */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <Privacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trending"
            element={
              <ProtectedRoute>
                <TrendingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route path="/edit-post/:id" element={<EditPostPage />} />

          {/* ✅ Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        {/* ✅ Bottom navigation (visible after login) */}
        <BottomNav />
      </Router>
    </UserProvider>
  );
}

export default App;
