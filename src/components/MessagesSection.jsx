import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const MessagesSection = () => {
  const { backendURL, user } = useUserContext();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // 🔹 Fetch friends (all users except logged-in)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${backendURL}/auth/all-users`, { withCredentials: true });
        const otherUsers = res.data.filter((u) => u._id !== user._id);
        setFriends(otherUsers);
      } catch (err) {
        console.error("Fetch friends error:", err);
      }
    };
    fetchFriends();
  }, [backendURL, user]);

  // 🔹 Fetch messages with selected friend
  useEffect(() => {
    if (!selectedFriend) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendURL}/messages/${selectedFriend._id}`, { withCredentials: true });
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };
    fetchMessages();
  }, [backendURL, selectedFriend]);

  // 🔹 Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    try {
      const res = await axios.post(
        `${backendURL}/messages`,
        { receiverId: selectedFriend._id, text: newMessage },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="flex h-[70vh] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Friends List */}
      <div className="w-1/3 border-r overflow-y-auto">
        {friends.map((friend) => (
          <div
            key={friend._id}
            onClick={() => setSelectedFriend(friend)}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
              selectedFriend?._id === friend._id ? "bg-gray-100" : ""
            }`}
          >
            <img
              src={friend.profilePic || "/default-avatar.png"}
              alt={friend.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="font-semibold text-sm">{friend.username}</p>
              <p className="text-gray-500 text-xs truncate w-40">{friend.lastMessage || ""}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 max-w-xs p-2 rounded-lg ${
                msg.sender._id === user._id ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Box */}
        {selectedFriend && (
          <div className="border-t p-2 flex items-center">
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="ml-2 text-blue-500 font-semibold"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        )}

        {!selectedFriend && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesSection;
