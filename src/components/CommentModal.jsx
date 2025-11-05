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
          className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl w-[90%] max-w-md mx-auto text-white overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-white/20">
            <h2 className="font-semibold text-lg">Comments</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Post Preview */}
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full h-48 object-cover border-b border-white/10"
            />
          )}

          {/* Comments List */}
          <div className="max-h-64 overflow-y-auto p-3 space-y-2">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/10 p-2 rounded-md text-sm border border-white/10"
                >
                  <strong className="text-yellow-300">
                    {c.user || "User"}:
                  </strong>{" "}
                  {c.text}
                </div>
              ))
            ) : (
              <p className="text-gray-300 text-sm text-center">
                No comments yet 💬
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex items-center border-t border-white/20 p-2 bg-white/10 backdrop-blur-md">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-white bg-transparent outline-none placeholder-white/60"
            />
            <button
              onClick={() => {
                if (comment.trim()) {
                  onAddComment(post._id, comment);
                  setComment("");
                }
              }}
              className="ml-2 text-blue-300 font-semibold hover:text-blue-400"
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
