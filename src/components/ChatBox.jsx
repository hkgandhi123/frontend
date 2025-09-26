import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const ChatBox = ({ user, currentChatUser }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Jab bhi message mile
    socket.on("receiveMessage", (msg) => {
      if (
        msg.sender._id === currentChatUser._id ||
        msg.recipients.includes(currentChatUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [socket, currentChatUser]);

  const sendMessage = () => {
    if (text.trim() && socket) {
      socket.emit("sendMessage", {
        sender: user._id,
        recipients: [currentChatUser._id],
        text,
      });
      setText("");
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender.username}:</b> {m.text}
          </p>
        ))}
      </div>
      <div className="input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
