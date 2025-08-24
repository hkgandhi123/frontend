import React from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Posts from "./components/Posts";

function App() {
  return (
    <div>
      <h1>Instagram Clone</h1>
      <Signup />
      <Login />
      <Posts />
    </div>
  );
}

export default App;

