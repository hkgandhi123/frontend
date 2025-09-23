import React from "react";
import { BsPlusSquare, BsCamera } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomeHeader = ({ setModalOpen, setStoryModalOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b flex justify-between items-center px-4 h-14">
      <h1 className="text-xl font-bold">Instagram</h1>

      <div className="flex space-x-5 text-xl">
        <BsPlusSquare onClick={() => setModalOpen(true)} className="cursor-pointer" />
        <BsCamera onClick={() => setStoryModalOpen(true)} className="cursor-pointer" />
        <AiOutlineHeart className="cursor-pointer" />
        <FiSend className="cursor-pointer" onClick={() => navigate("/messages")} />
      </div>
    </div>
  );
};

export default HomeHeader;

