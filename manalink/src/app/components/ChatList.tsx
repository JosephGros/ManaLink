"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomLoader from "./CustomLoading";

interface MessageItem {
  id: string;
  name: string;
  preview: string;
  type: "user" | "group";
  profilePicture: string;
  readBy: string[];
  createdAt: string;
  otherUserId: string;
}

interface ParsedMessageItem extends Omit<MessageItem, "createdAt"> {
  roomId?: string;
  createdAt: Date;
}

const fetchMessages = async (userId: string): Promise<MessageItem[]> => {
  const response = await fetch(`/api/message-list?userId=${userId}`);
  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    console.log("No conversations found");
    return [];
  }

  return Promise.all(
    data.map(async (message: any) => {
      let otherUserId = "";
      let otherUserName = "Unknown User";
      let otherUserProfilePicture = "/assets/profile-pics/mtg.webp";

      if (message.type === "user") {
        otherUserId = message.otherUserId;

        console.log(
          "senderId:",
          message.senderId,
          "recipientId:",
          message.recipientId,
          "otherUserId:",
          otherUserId
        );

        if (!otherUserId) {
          console.error("otherUserId is undefined for message:", message);
          return {
            ...message,
            name: "Im sneaky!",
            profilePicture: "/assets/profile-pics/mtg.webp",
            roomId: message.roomId || message._id,
            otherUserId,
          };
        }

        const userResponse = await fetch(
          '/api/user-details',
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: otherUserId }),
          }
        );
        const otherUser = await userResponse.json();

        if (otherUser) {
          otherUserName = otherUser.user.username;
          otherUserProfilePicture = otherUser.user.profilePicture;
          console.log(otherUserName, otherUserProfilePicture);
        }

        return {
          ...message,
          name: message.type === "user" ? otherUserName : message.name,
          profilePicture:
            message.type === "user"
              ? otherUserProfilePicture
              : message.profilePicture,
          roomId: message.roomId || message._id,
          otherUserId,
        };
      } else if (message.type === "group") {
        return {
          ...message,
          name: message.name || "Unknown Group",
          profilePicture:
            message.profilePicture || "/assets/profile-pics/mtg.webp",
          roomId: message.roomId || message._id,
        };
      }

      return message;
    })
  );
};

const MessagesPage = () => {
  const [messages, setMessages] = useState<ParsedMessageItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const getMessages = async () => {
        const data = await fetchMessages(user._id);
        const sortedMessages: ParsedMessageItem[] = data
          .map((message) => ({
            ...message,
            createdAt: new Date(message.createdAt),
            readBy: message.readBy ?? [],
          }))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setMessages(Array.isArray(sortedMessages) ? sortedMessages : []);
        console.log(sortedMessages);
      };

      getMessages();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="space-y-4 p-4 overflow-auto">
      <div className="flex flex-col items-center">
        {messages.map((message) => (
          <Link
            key={message.id}
            href={
              message.type === "user"
                ? `/chat/${message.id}?otherUserId=${message.otherUserId}&otherUsername=${message.name}`
                : `/playgroups/${message.id}?playgroup=${message.name}&playgroupId=${message.id}`
            }
          >
            <div className="flex items-center p-2 sm:w-96 w-80 bg-bg2 rounded-lg hover:bg-bg3 cursor-pointer shadow-md my-1">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <Image
                  src={message.profilePicture}
                  alt={`${message.name} profile`}
                  height={48}
                  width={48}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-bold text-lg truncate max-w-56">
                  {message.name}
                </p>
                <p className="text-sm text-gray-400 truncate max-w-56">
                  {message.preview}
                </p>
              </div>
              <div className="flex-shrink-0">
                {message.readBy &&
                  message.readBy.length > 0 &&
                  !message.readBy.includes(user._id) && (
                    <span className="block w-3 h-3 rounded-full bg-btn"></span>
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;