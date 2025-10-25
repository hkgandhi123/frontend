import React, { useState, useEffect } from "react";
import { searchUsers } from "../api";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        const data = await searchUsers(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Search Users</h2>

      <input
        type="text"
        placeholder="Search username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-3 focus:ring focus:outline-none"
      />

      {loading ? (
        <p className="text-center text-gray-500">Searching...</p>
      ) : results.length > 0 ? (
        <ul>
          {results.map((user) => (
            <li
              key={user._id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <img
                src={user.profilePic ? user.profilePic + `?t=${Date.now()}` : "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-600 truncate">{user.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        query && <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default SearchPage;
