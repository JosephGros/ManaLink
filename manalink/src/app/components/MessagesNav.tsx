"use client";
import Image from "next/image";
import { useState } from "react";
import newChat from "../../../public/assets/Icons/NavColor/comment-alt-medical.png";
import newPlaygroup from "../../../public/assets/Icons/NavColor/playgroup2.png";
import NewDMModal from "./NewDM";
import NewPlaygroupModal from "./NewPlaygroup";

const ChatNav = () => {
  const [showNewDMModal, setShowNewDMModal] = useState(false);
  const [showNewPlaygroupModal, setShowNewPlaygroupModal] = useState(false);

  return (
    <>
      <div className="border-t border-bg3 bg-background flex flex-row justify-center justify-evenly items-center h-14">
        <button
          onClick={() => setShowNewDMModal(true)}
          className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
        >
          <Image src={newChat} alt="Users" width={33} height={33} />
        </button>
        <button
          onClick={() => setShowNewPlaygroupModal(true)}
          className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
        >
          <Image src={newPlaygroup} alt="Playgroup" width={33} height={33} />
        </button>
      </div>

      {showNewDMModal && <NewDMModal onClose={() => setShowNewDMModal(false)} />}
      {showNewPlaygroupModal && <NewPlaygroupModal onClose={() => setShowNewPlaygroupModal(false)} />}
    </>
  );
};

export default ChatNav;
