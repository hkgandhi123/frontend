import React from "react";
import FollowButton from "./FollowButton";

const UserCard = ({ u, startPrivateChat, closeModal }) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
      <span className="font-medium cursor-pointer"
            onClick={() => window.location.href = `/profile/${u._id}`}>
        {u.username}
      </span>
      <div className="flex space-x-2">
        <FollowButton userToFollow={u} />

        <button
          onClick={() => {
            startPrivateChat(u._id, u.username);
            closeModal();
          }}
          className="text-gray-600 text-sm border px-2 py-1 rounded-md"
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default UserCard;
