// src/pages/Messages.jsx
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messages = () => {
  const { user, backendURL } = useUserContext();
  const API = backendURL || "http://localhost:5000";

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [users, setUsers] = useState([]); // ✅ All other users
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect socket
  useEffect(() => {
    socketRef.current = io(API, { withCredentials: true });
    socketRef.current.on("connect", () => {
      if (user?._id) socketRef.current.emit("join", { userId: user._id });
    });
    socketRef.current.on("receiveMessage", (msg) => {
      if (!msg) return;
      setConversations((prev) => {
        const convKey = `user:${msg.sender?._id === user._id ? msg.recipients[0] : msg.sender._id}`;
        const prevConv = prev.find((c) => c.key === convKey);
        const formattedMsg = {
          _id: msg._id || `${Date.now()}`,
          sender: msg.sender,
          text: msg.text,
          createdAt: msg.createdAt || new Date().toISOString(),
        };
        if (prevConv) {
          return prev.map((c) =>
            c.key === convKey
              ? { ...c, lastMessage: msg.text, messages: [...c.messages, formattedMsg] }
              : c
          );
        } else {
          const newConv = {
            key: convKey,
            id: msg.sender?._id,
            name: msg.sender?.username || "User",
            type: "private",
            participants: [msg.sender?._id, ...msg.recipients],
            lastMessage: msg.text,
            messages: [formattedMsg],
          };
          return [newConv, ...prev];
        }
      });
    });
    return () => socketRef.current?.disconnect();
  }, [API, user?._id]);

  // Fetch users
  useEffect(() => {
    if (!user?._id) return;
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users`, { withCredentials: true });
        setUsers(res.data || []);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };
    fetchUsers();
  }, [user?._id, API]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages?.length, selectedConv]);

  const handleSend = async () => {
    if (!text.trim() || !selectedConv) return;
    const payload = {
      sender: user._id,
      recipients: [selectedConv.id],
      text: text.trim(),
      chatType: "private",
    };
    try {
      const res = await axios.post(`${API}/messages`, payload, { withCredentials: true });
      const saved = res.data;
      setConversations((prev) =>
        prev.map((c) =>
          c.key === selectedConv.key
            ? { ...c, messages: [...c.messages, saved], lastMessage: saved.text }
            : c
        )
      );
      setText("");
      socketRef.current?.emit("sendMessage", saved);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const startPrivateChat = (otherUser) => {
    const key = `user:${otherUser._id}`;
    const existing = conversations.find((c) => c.key === key);
    if (existing) {
      setSelectedConv(existing);
      return;
    }
    const newConv = {
      key,
      id: otherUser._id,
      name: otherUser.username,
      type: "private",
      participants: [otherUser._id, user._id],
      lastMessage: "",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setSelectedConv(newConv);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white hidden md:block">
        <div className="sticky top-0 h-14 flex items-center justify-center font-bold border-b z-10 bg-white">
          Messages
        </div>

        <div className="overflow-y-auto h-[calc(100vh-56px)]">
          {/* Users to start chat */}
          <div className="p-3">
            <h3 className="font-semibold mb-2 text-sm">Start a new chat</h3>
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => startPrivateChat(u)}
                className="p-2 cursor-pointer rounded hover:bg-gray-100"
              >
                {u.username}
              </div>
            ))}
          </div>

          {/* Existing conversations */}
          {conversations.map((conv) => (
            <div
              key={conv.key}
              onClick={() => setSelectedConv(conv)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                selectedConv?.key === conv.key ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{conv.name}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.lastMessage || "Say hi!"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="fixed left-0 md:left-80 right-0 top-0 h-14 border-b bg-white flex items-center px-4 z-10">
          {selectedConv ? <div className="font-semibold">{selectedConv.name}</div> : "Select a chat"}
        </div>

        <div className="pt-16 pb-24 px-4 flex-1 overflow-y-auto">
          {selectedConv?.messages?.length ? (
            selectedConv.messages.map((m, idx) => (
              <div
                key={m._id || idx}
                className={`flex ${m.sender._id === user._id ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] px-4 py-2 rounded-lg ${m.sender._id === user._id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {m.text}
                  <div className="text-[10px] text-gray-700 mt-1 text-right">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-6">No messages yet — select a user to start chat</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedConv && (
          <div className="fixed left-0 md:left-80 right-0 bottom-0 bg-white border-t p-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder={`Message ${selectedConv.name}...`}
                className="flex-1 border rounded-full px-4 py-2"
              />
              <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-full">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

