// src/components/StoryViewerModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";

const StoryViewerModal = ({ story, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setProgress(0);

    // Auto close after 5s for image, video duration for video
    const duration =
      story.type === "video"
        ? videoRef.current?.duration * 1000 || 5000
        : 5000;

    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressRef.current);
          onClose();
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(progressRef.current);
  }, [story, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-start items-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl z-50"
      >
        <AiOutlineClose />
      </button>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/30 mt-4">
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Story Content */}
      <div className="flex-1 flex justify-center items-center w-full p-4">
        {story.type === "video" ? (
          <video
            ref={videoRef}
            src={story.media}
            autoPlay
            muted
            className="max-h-[80vh] max-w-full object-contain rounded"
            onLoadedMetadata={() => {
              // Reset progress when video metadata loads
              setProgress(0);
            }}
          />
        ) : (
          <img
            src={story.media}
            alt="Story"
            className="max-h-[80vh] max-w-full object-contain rounded"
          />
        )}
      </div>

      {/* Story Footer: username, like, comment */}
      <div className="w-full flex justify-between items-center px-6 pb-4 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={story.user?.profilePic}
            alt={story.user?.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="font-semibold">{story.user?.username}</span>
        </div>
        <div className="flex space-x-4 text-2xl">
          <button onClick={() => setLiked(!liked)}>
            {liked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
          </button>
          <button>
            <BsChatDots />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewerModal;
