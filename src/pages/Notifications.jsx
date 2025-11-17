import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

// Sample notification types with icons
const actionIcons = {
  upvote: "👍",
  downvote: "👎",
  repost: "🔁",
  share: "📤",
  follow: "➕",
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://bkc-dt1n.onrender.com"; // Replace with your backend

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Fetch notifications from backend
        // Backend should return array of notifications with fields:
        // { _id, user: {username, profilePic}, type, postTitle, createdAt }
        const res = await axios.get(`${BASE_URL}/api/notifications`);
        setNotifications(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white">
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full flex items-center p-4 bg-gray-800/90 backdrop-blur-sm z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:text-gray-300 transition"
        >
          <LuChevronLeft size={24} className="mr-2" />
          Back
        </button>
        <h1 className="ml-4 text-xl font-bold">Notifications</h1>
      </div>

      {/* Notifications list */}
      <div className="pt-20 px-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No notifications yet!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="flex items-start space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              {/* User avatar */}
              <img
                src={notif.user.profilePic || "/default-avatar.png"}
                alt={notif.user.username}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Notification content */}
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-semibold">{notif.user.username}</span>{" "}
                  {actionIcons[notif.type] || ""}{" "}
                  <span>
                    {notif.type === "follow"
                      ? "started following you"
                      : `${notif.type}ed your post: `}
                  </span>
                  {notif.postTitle && (
                    <span className="font-semibold">"{notif.postTitle}"</span>
                  )}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-left-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
