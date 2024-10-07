"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchPopup from "./SearchPopup";

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
        router.push(`/chat/${dmId}?otherUserId=${selectedUser._id}`);
        onClose();
      } else {
        console.error("Failed to start new DM");
      }
    } catch (error) {
      console.error("Error starting new DM:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-11/12 max-w-lg bg-white p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">Start a New DM</h2>
        <SearchPopup
          onSelectUser={handleSelectUser}
          currentUserId={currentUser?._id || ""}
        />
        {selectedUser && (
          <div className="mt-4">
            <p>Selected User: {selectedUser.username}</p>
            <input
              type="text"
              placeholder="Enter your first message"
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              className="p-2 w-full border border-gray-300 rounded"
            />
            <button
              className="bg-btn p-2 rounded-md mt-4"
              onClick={handleStartChat}
            >
              Start Chat
            </button>
          </div>
        )}
        <button className="mt-4 text-danger2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default NewDMModal;