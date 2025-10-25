import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { followUser, unfollowUser } from "../api";

const UserListModal = ({ isOpen, onClose, title, users }) => {
  const navigate = useNavigate();
  const { user, updateUserContext } = useUserContext();
  const [followingState, setFollowingState] = useState(
    users.reduce((acc, u) => {
      acc[u._id] = u.followers?.includes(user?._id);
      return acc;
    }, {})
  );

  if (!isOpen) return null;

  const handleFollowToggle = async (u) => {
    try {
      if (followingState[u._id]) {
        await unfollowUser(u._id);
        setFollowingState((prev) => ({ ...prev, [u._id]: false }));
        // Update local user context
        updateUserContext({
          ...user,
          following: user.following.filter((id) => id !== u._id),
        });
      } else {
        await followUser(u._id);
        setFollowingState((prev) => ({ ...prev, [u._id]: true }));
        updateUserContext({
          ...user,
          following: [...(user.following || []), u._id],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 max-h-[80vh] rounded p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 font-bold">X</button>
        </div>
        <div className="flex flex-col space-y-3">
          {users.length === 0 && <p>No users</p>}
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <div className="flex items-center space-x-3" onClick={() => {
                navigate(`/profile/${u._id}`);
                onClose();
              }}>
                <img
                  src={u.profilePic || "/default-avatar.png"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{u.username}</span>
              </div>
              {u._id !== user._id && (
                <button
                  onClick={() => handleFollowToggle(u)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    followingState[u._id] ? "bg-gray-300" : "bg-blue-500 text-white"
                  }`}
                >
                  {followingState[u._id] ? "Following" : "Follow"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
