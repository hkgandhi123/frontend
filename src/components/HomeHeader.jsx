import { BsPlusSquare, BsCamera } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi"; // 3-line icon

const HomeHeader = ({ setModalOpen, setStoryModalOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b flex justify-between items-center px-4 h-8 z-50">

      {/* Create Post / Hamburger Icon */}
<GiHamburgerMenu
  className="cursor-pointer text-2xl"
  onClick={(e) => {
    e.stopPropagation();
    setModalOpen(true);
  }}
/>
         <h1 className="text-xl font-bold">HitBit</h1>

      <div className="flex space-x-5 text-xl">
        

        

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

