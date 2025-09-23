import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { BsBookmark, BsChat, BsThreeDots } from "react-icons/bs";
import axios from "axios";

function Profile() {
  const { user, posts, setPosts, backendURL, loading } = useUserContext();
  const [showMenu, setShowMenu] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [newCaption, setNewCaption] = useState("");

  if (loading)
    return (
      <p className="text-center mt-20 animate-pulse text-gray-500 text-lg">
        Loading...
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">
        Please login ❌
      </p>
    );

  // 🔹 Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${backendURL}/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted ✅");
    } catch (err) {
      console.error("Delete post error:", err.response || err);
      alert(
        err.response?.data?.message || "Failed to delete post ❌. Try again!"
      );
    }
  };

  // 🔹 Edit Post
  const handleEditPost = async () => {
    if (!editingPost) return;
    try {
      const { data } = await axios.put(
        `${backendURL}/posts/${editingPost._id}`,
        { caption: newCaption },
        { withCredentials: true }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === editingPost._id ? data.post || data : p))
      );
      setEditingPost(null);
      alert("Post updated ✅");
    } catch (err) {
      console.error("Edit post error:", err.response || err);
      alert("Failed to update ❌");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 md:px-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start w-40 h-40">
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-36 h-36 rounded-full border-4 border-gray-300 object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 mt-6 md:mt-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl md:text-3xl font-light">{user.username}</h2>
            <Link to="/edit-profile">
              <button className="px-4 py-1 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition">
                Edit Profile
              </button>
            </Link>
          </div>

          <div className="flex space-x-8 mt-4 text-sm md:text-base">
            <div>
              <span className="font-semibold">{posts.length}</span> posts
            </div>
            <div>
              <span className="font-semibold">10.5k</span> followers
            </div>
            <div>
              <span className="font-semibold">350</span> following
            </div>
          </div>

          <div className="mt-3 md:mt-4 text-sm md:text-base">
            <p className="font-medium">{user.fullName || user.username}</p>
            <p className="text-gray-700">{user.bio || "No bio yet"}</p>
          </div>
        </div>
      </div>

      <div className="border-t mt-8"></div>

      {/* Posts Feed */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 mt-6 md:mt-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3 relative">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/50"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm">{user.username}</span>
                </div>

                {/* 3-dot menu */}
                <div className="relative">
                  <button
                    className="text-xl hover:opacity-70"
                    onClick={() =>
                      setShowMenu(showMenu === post._id ? null : post._id)
                    }
                  >
                    <BsThreeDots />
                  </button>

                  {showMenu === post._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                      <button
                        onClick={() => {
                          handleDeletePost(post._id);
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setNewCaption(post.caption || "");
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Copy Link
                      </button>
                      <button
                        onClick={() => setShowMenu(null)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Image */}
              <div className="w-full aspect-square bg-gray-200">
                <img
                  src={post.image || "https://via.placeholder.com/600"}
                  alt="post"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex space-x-4 text-xl">
                  <button className="hover:opacity-70">
                    <AiOutlineHeart />
                  </button>
                  <button className="hover:opacity-70">
                    <BsChat />
                  </button>
                  <button className="hover:opacity-70">
                    <FiSend />
                  </button>
                </div>
                <button className="hover:opacity-70 text-xl">
                  <BsBookmark />
                </button>
              </div>

              {/* Caption */}
              <div className="px-4 pb-3">
                <p className="text-sm">
                  <span className="font-semibold">{user.username}</span>{" "}
                  {post.caption || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">No posts yet 📷</p>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Edit Post</h2>
            <textarea
              className="w-full border rounded-md p-2 mb-4"
              rows="3"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
