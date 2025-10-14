import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import Search from "./pages/Search";
import Reels from "./pages/Reels";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages"

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/messages" element={<Messages/>}/>
        </Routes>

        {/* BottomNav globally */}
        <BottomNav />
      </Router>
    </UserProvider>
  );
}

export default App;
