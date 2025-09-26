import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?._id) {
      const s = io("https://bkc-dt1n.onrender.com", {
        withCredentials: true,
      });

      // Apna userId join karo
      s.emit("join", { userId: user._id });

      setSocket(s);

      return () => s.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
