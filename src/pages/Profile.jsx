import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://bkc-dt1n.onrender.com/auth/profile",
          { withCredentials: true }
        );
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Fetch posts
  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(
            "https://bkc-dt1n.onrender.com/posts/my-posts",
            { withCredentials: true }
          );
          if (res.data.success) setPosts(res.data.posts);
        } catch (err) {
          console.error("Error fetching posts:", err);
        }
      };
      fetchPosts();
    }
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg animate-pulse text-gray-500">Loading...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">Please login to view profile ❌</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
        {/* Profile Picture */}
        <div className="flex justify-center md:justify-start w-40 h-40">
          <img
            src={
              user.profilePic
                ? `https://bkc-dt1n.onrender.com${user.profilePic}`
                : "https://via.placeholder.com/150"
            }
            alt="profile"
            className="w-36 h-36 rounded-full border-2 border-gray-300 object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 mt-6 md:mt-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold">{user.username}</h2>
            <Link to="/edit-profile">
              <button className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                Edit Profile
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 mt-4">
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

          {/* Bio */}
          <div className="mt-4">
            <p className="font-medium">{user.fullName || user.username}</p>
            <p className="text-gray-700">{user.bio || "No bio yet"}</p>
          </div>
        </div>
      </div>

      <div className="border-t mt-8"></div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 mt-6">
          {posts.map((post) => (
            <div key={post._id} className="aspect-square bg-gray-200">
              <img
                src={`https://bkc-dt1n.onrender.com${post.image}`}
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No posts yet 📷</p>
      )}
    </div>
  );
}

export default Profile;
