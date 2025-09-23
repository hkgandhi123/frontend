import React, { useEffect, useState, useRef } from "react";
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";

const StoryViewerModal = ({ stories, currentIndex, onClose, setCurrentIndex }) => {
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  const story = stories[currentIndex];

  // Auto progress
  useEffect(() => {
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(progressRef.current);
  }, [story]);

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLiked(false);
    } else {
      onClose(); // End of stories
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLiked(false);
    }
  };

  // Swipe handlers
  const handleClick = (e) => {
    const x = e.clientX;
    if (x < window.innerWidth / 2) prevStory();
    else nextStory();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col justify-start items-center cursor-pointer"
      onClick={handleClick}
    >
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
        {story.media?.endsWith(".mp4") ? (
          <video
            src={story.media}
            autoPlay
            muted
            className="max-h-[80vh] max-w-full object-contain rounded"
          />
        ) : (
          <img
            src={story.media}
            alt="Story"
            className="max-h-[80vh] max-w-full object-contain rounded"
          />
        )}
      </div>

      {/* Footer */}
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
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
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
