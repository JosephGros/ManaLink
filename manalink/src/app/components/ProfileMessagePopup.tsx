"use client";

import Image from "next/image";
import { useState } from "react";
import sendIcon from "../../../public/assets/Icons/NavColor/paper-plane2.png";
import closeIcon from "../../../public/assets/Icons/IconColor/cross-circle.png";

interface ProfileMessagePopupProps {
  onClose: () => void;
  onSend: (message: string) => void;
}

const ProfileMessagePopup = ({ onClose, onSend }: ProfileMessagePopupProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-textcolor">
      <div className="w-11/12 max-w-lg bg-bg2 p-6 rounded-md">
      <button
          className="place-self-start w-6 h-6 rounded-full font-bold flex justify-center items-center"
          onClick={onClose}
        >
          <Image
            src={closeIcon}
            alt="Close Icon"
            width={20}
            height={20}
            className="inline-block"
          />
        </button>
        <h2 className="text-3xl font-bold mb-4 flex justify-center">Send Message</h2>
        <div className="flex items-center justify-center mb-2">
        <textarea
          className="overflow-y-auto w-11/12 resize-none bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 mr-2 break-words"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
          }}
          placeholder="Type a message..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              e.preventDefault();
              handleSend();
            }
          }}
        />
          <button
            onClick={handleSend}
            className="bg-btn text-nav font-bold px-4 py-2 rounded-md"
          >
            <Image
              src={sendIcon}
              alt="Remove Friend"
              width={25}
              height={25}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMessagePopup;