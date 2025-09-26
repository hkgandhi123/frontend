import { BsPlusSquare, BsCamera } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomeHeader = ({ setModalOpen, setStoryModalOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b flex justify-between items-center px-4 h-14 z-50">
      <h1 className="text-xl font-bold">BKC&funS</h1>

      <div className="flex space-x-5 text-xl">
        {/* Create Post Modal */}
        <BsPlusSquare 
          className="cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }} 
        />

        {/* Create Story Modal */}
        <BsCamera 
          className="cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            setStoryModalOpen(true);
          }} 
        />

        {/* Notifications Page */}
        <AiOutlineHeart 
          className="cursor-pointer" 
          onClick={() => navigate("/notifications")} 
        />

        {/* Messages Page */}
        <FiSend 
          className="cursor-pointer" 
          onClick={() => navigate("/messages")} 
        />
      </div>
    </div>
  );
};

export default HomeHeader;

