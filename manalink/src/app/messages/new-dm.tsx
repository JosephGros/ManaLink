"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SearchPopup from "../components/SearchPopup";

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

const NewDMPage = ({ currentUserId }: { currentUserId: string }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const handleCreateDM = async () => {
    if (!selectedUser) return;

    const response = await fetch("/api/messages/dm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: currentUserId,
        recipientId: selectedUser._id,
      }),
    });

    if (response.ok) {
      const conversation = await response.json();
      router.push(`/chat/${conversation.roomId}`);
    } else {
      console.error("Failed to create conversation");
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Start a New Direct Message</h1>
      {!selectedUser ? (
        <SearchPopup
          currentUserId={currentUserId}
          onSelectUser={handleSelectUser}
        />
      ) : (
        <div>
          <p>Selected user: {selectedUser.username}</p>
          <button
            onClick={handleCreateDM}
            className="bg-btn p-2 rounded-md text-textcolor"
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default NewDMPage;