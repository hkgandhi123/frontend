import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const FollowButton = ({ userToFollow }) => {
  const { user, setUser, backendURL } = useUserContext();
  const [loading, setLoading] = useState(false);

  const isFollowing = user.following.includes(userToFollow._id);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await axios.put(`${backendURL}/users/unfollow/${userToFollow._id}`, {}, { withCredentials: true });
        setUser(prev => ({ ...prev, following: prev.following.filter(id => id !== userToFollow._id) }));
      } else {
        await axios.put(`${backendURL}/users/follow/${userToFollow._id}`, {}, { withCredentials: true });
        setUser(prev => ({ ...prev, following: [...prev.following, userToFollow._id] }));
      }
    } catch (err) {
      console.error(err);
      alert("Action failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-sm ${isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
