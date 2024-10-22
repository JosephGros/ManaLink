"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchPopup from "./SearchPopup";
import Image from "next/image";
import closeIcon from "../../../public/assets/Icons/IconColor/cross-circle.png";
import sendIcon from "../../../public/assets/Icons/NavColor/paper-plane2.png";

interface User {
  _id: string;
  username: string;
  userCode: string;
  profilePicture: string;
}

const NewDMModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firstMessage, setFirstMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setCurrentUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleStartChat = async () => {
    if (!selectedUser || !firstMessage.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/dm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser?._id,
          recipientId: selectedUser._id,
          firstMessage,
        }),
      });

      if (response.ok) {
        const { dmId } = await response.json();
        router.push(`/chat/${dmId}?otherUserId=${selectedUser._id}&otherUsername=${selectedUser.username}`);
        onClose();
      } else {
        console.error("Failed to start new DM");
      }
    } catch (error) {
      console.error("Error starting new DM:", error);
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
        <h2 className="text-3xl font-bold mb-4 flex justify-center">New DM</h2>
        <SearchPopup
          onSelectUser={handleSelectUser}
          currentUserId={currentUser?._id || ""}
        />
        {selectedUser && (
          <div className="mt-4 flex flex-col items-center">
            <p className="font-bold text-lg">{selectedUser.username}</p>
            <div className="max-w-96 flex items-center justify-center mb-2">
                <input
                type="text"
                placeholder="Enter your first message"
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                className="w-72 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
                />
                <button
                onClick={handleStartChat}
                className="bg-btn ml-2 rounded-md shadow-lg h-10 w-10 flex justify-center items-center"
                >
                    <Image
                    src={sendIcon}
                    alt="Remove user"
                    width={25}
                    height={25}
                    className="w-6 h-6"
                    />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewDMModal;