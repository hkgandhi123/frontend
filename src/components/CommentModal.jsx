import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CommentModal = ({ post, onClose, onAddComment }) => {
  const [comment, setComment] = useState("");
  const modalRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal Box */}
        <motion.div
          ref={modalRef}
          className="bg-white/90 border border-black/20 rounded-2xl shadow-2xl w-[90%] max-w-md mx-auto text-black overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-black/20">
            <h2 className="font-semibold text-lg">Comments</h2>
            <button
              onClick={onClose}
              className="text-black/80 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {/* Post Preview */}
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full h-48 object-cover border-b border-black/10"
            />
          )}

          {/* Comments List */}
          <div className="max-h-64 overflow-y-auto p-3 space-y-2">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-black/10 p-2 rounded-md text-sm border border-black/10"
                >
                  <strong className="text-yellow-700">{c.user || "User"}:</strong>{" "}
                  {c.text}
                </div>
              ))
            ) : (
              <p className="text-gray-700 text-sm text-center">No comments yet 💬</p>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex items-center border-t border-black/20 p-2 bg-black/10 backdrop-blur-md">
            <input
  type="text"
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  placeholder="Add a comment..."
  className="flex-1 px-3 py-2 text-sm text-black bg-white/80 outline-none placeholder-black/60 rounded-md"
/>

            <button
              onClick={() => {
                if (comment.trim()) {
                  onAddComment(post._id, comment);
                  setComment("");
                }
              }}
              className="ml-2 text-blue-700 font-semibold hover:text-blue-800"
            >
              Post
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentModal;
