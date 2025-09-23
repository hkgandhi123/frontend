// src/pages/Messages.jsx
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messages = () => {
  const { user, backendURL } = useUserContext(); // your context earlier had backendURL in other code
  const API = backendURL || "http://localhost:5000";

  const [conversations, setConversations] = useState([]); // { id, name, type, lastMessage, participants: [], messages: [] }
  const [selectedConv, setSelectedConv] = useState(null);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect socket
  useEffect(() => {
    socketRef.current = io(API, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      // optional: identify to server (if you plan to use rooms)
      if (user?.id || user?._id) {
        socketRef.current.emit("join", { userId: user._id || user.id });
      }
    });

    socketRef.current.on("receiveMessage", (msg) => {
      // msg should be the saved message object returned by backend
      if (!msg) return;

      setConversations((prev) => {
        // find matching conversation
        const isGroup = msg.chatType === "group";
        const convKey = isGroup ? `group:${msg.groupName}` : `user:${getConvOtherId(msg, user)}`;

        const prevConv = prev.find((c) => c.key === convKey);
        if (prevConv) {
          // append message
          const updated = prev.map((c) =>
            c.key === convKey
              ? {
                  ...c,
                  lastMessage: msg.text,
                  messages: [...c.messages, formatMsg(msg)],
                }
              : c
          );
          return updated;
        } else {
          // create new conversation
          const newConv = {
            key: convKey,
            id: isGroup ? msg.groupName : getConvOtherId(msg, user),
            name: isGroup ? msg.groupName : msg.sender?.username || "User",
            type: msg.chatType,
            participants: msg.recipients || [],
            lastMessage: msg.text,
            messages: [formatMsg(msg)],
          };
          return [newConv, ...prev];
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line
  }, [API, user?._id]);

  // Helpers
  const formatMsg = (msg) => ({
    _id: msg._id || `${Date.now()}`,
    sender: msg.sender,
    text: msg.text,
    createdAt: msg.createdAt || new Date().toISOString(),
  });

  const getConvOtherId = (msg, currentUser) => {
    // for private chat: find the id of other participant
    const curId = currentUser?._id || currentUser?.id;
    if (!curId) return msg.recipients?.[0] || msg.sender?._id;
    if (msg.chatType === "group") return msg.groupName;
    // recipients is array - choose the one that's not current user
    const other = (msg.recipients || []).find((r) => String(r) !== String(curId));
    if (other) return other;
    // if sender is other
    if (String(msg.sender?._id) !== String(curId)) return msg.sender?._id;
    // fallback
    return msg.recipients?.[0] || msg.sender?._id;
  };

  // Build conversation list from messages involving current user
  useEffect(() => {
    if (!user?._id) return;
    const fetch = async () => {
      try {
        // Our backend GET /messages/:chatId returns messages where recipients includes chatId
        const res = await axios.get(`${API}/messages/${user._id}`, { withCredentials: true });
        const messages = res.data || [];

        // Group messages into conversations
        const map = new Map();
        messages.forEach((m) => {
          const isGroup = m.chatType === "group";
          const key = isGroup ? `group:${m.groupName}` : `user:${getConvOtherId(m, user)}`;
          const otherId = isGroup ? m.groupName : getConvOtherId(m, user);
          const name = isGroup ? m.groupName : m.sender?.username || otherId;

          if (!map.has(key)) {
            map.set(key, {
              key,
              id: otherId,
              name,
              type: m.chatType,
              participants: m.recipients || [],
              lastMessage: m.text,
              messages: [formatMsg(m)],
            });
          } else {
            const obj = map.get(key);
            obj.messages.push(formatMsg(m));
            // update last message timestamp sorting later
            if (new Date(m.createdAt) > new Date(obj.lastMessage?.createdAt || 0)) {
              obj.lastMessage = m.text;
            }
            map.set(key, obj);
          }
        });

        // Convert to array and sort by latest message time (descending)
        const convs = Array.from(map.values()).map((c) => {
          // sort messages in a conv by createdAt asc
          c.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          return c;
        });

        convs.sort((a, b) => {
          const at = a.messages[a.messages.length - 1]?.createdAt || 0;
          const bt = b.messages[b.messages.length - 1]?.createdAt || 0;
          return new Date(bt) - new Date(at);
        });

        setConversations(convs);
        // auto select first conv if none selected
        if (convs.length && !selectedConv) setSelectedConv(convs[0]);
      } catch (err) {
        console.error("Fetch conv error", err);
      }
    };

    fetch();
    // eslint-disable-next-line
  }, [user?._id, API]);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages?.length, selectedConv]);

  // Send message
  const handleSend = async () => {
    if (!text.trim() || !user) return;
    if (!selectedConv) return;

    const payload = {
      sender: user._id || user.id,
      recipients:
        selectedConv.type === "group"
          ? selectedConv.participants // group participants array (should contain ids)
          : [selectedConv.id], // private: other user id
      text: text.trim(),
      chatType: selectedConv.type,
      groupName: selectedConv.type === "group" ? selectedConv.name : undefined,
    };

    try {
      const res = await axios.post(`${API}/messages`, payload, { withCredentials: true });
      const saved = res.data;

      // locally append
      const formatted = formatMsg(saved);
      setConversations((prev) =>
        prev.map((c) =>
          c.key === selectedConv.key
            ? { ...c, messages: [...c.messages, formatted], lastMessage: saved.text }
            : c
        )
      );
      setText("");

      // Emit over socket so other clients receive
      socketRef.current?.emit("sendMessage", saved);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // Start a new private chat (helper)
  const startPrivateChat = (otherUserId, displayName = "User") => {
    const key = `user:${otherUserId}`;
    const existing = conversations.find((c) => c.key === key);
    if (existing) {
      setSelectedConv(existing);
      return;
    }
    const newConv = {
      key,
      id: otherUserId,
      name: displayName,
      type: "private",
      participants: [otherUserId, user._id],
      lastMessage: "",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setSelectedConv(newConv);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white hidden md:block">
        <div className="sticky top-0 bg-white border-b h-14 flex items-center justify-center font-bold z-10">
          Messages
        </div>

        <div className="overflow-y-auto h-[calc(100vh-56px)]">
          <div className="p-3">
            <button
              onClick={() => {
                // quick demo to start a new chat (replace with real search)
                const demoId = "demo-user-id-123";
                startPrivateChat(demoId, "Demo User");
              }}
              className="w-full text-sm py-2 border rounded-md"
            >
              + New Chat (demo)
            </button>
          </div>

          {conversations.length === 0 && (
            <div className="p-4 text-gray-500">No conversations yet</div>
          )}

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
                  <p className="text-xs text-gray-500 truncate" style={{ maxWidth: 220 }}>
                    {conv.lastMessage || (conv.messages[conv.messages.length - 1]?.text ?? "Say hi!")}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {conv.type === "group" ? "👥" : "💬"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="fixed left-0 right-0 md:left-80 bg-white border-b h-14 flex items-center px-4 z-10">
          {selectedConv ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {selectedConv.type === "group" ? "G" : selectedConv.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-semibold">{selectedConv.name}</div>
                <div className="text-xs text-gray-500">
                  {selectedConv.type === "group" ? "Group" : "Direct message"}
                </div>
              </div>
            </div>
          ) : (
            <div className="font-semibold">Select a chat</div>
          )}
        </div>

        {/* Messages list */}
        <div className="pt-16 pb-24 px-4 flex-1 overflow-y-auto">
          {!selectedConv ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          ) : (
            <div>
              {selectedConv.messages.length === 0 && (
                <div className="text-center text-gray-400 py-6">No messages yet — say hello 👋</div>
              )}

              <div className="space-y-3">
                {selectedConv.messages.map((m) => {
                  const isMine = String(m.sender?._id || m.sender?.id) === String(user?._id || user?.id);
                  return (
                    <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                        <div className="text-sm">{m.text}</div>
                        <div className="text-[10px] text-gray-700 mt-1 text-right">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {selectedConv && (
          <div className="fixed left-0 md:left-80 right-0 bottom-0 bg-white border-t p-3">
            {user ? (
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder={`Message ${selectedConv.name}...`}
                  className="flex-1 border rounded-full px-4 py-2"
                />
                <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-full">
                  Send
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500">Please login to send messages.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
