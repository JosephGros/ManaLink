"use client";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import CustomLoader from "./CustomLoading";
import Image from "next/image";

interface Message {
  _id: string;
  content: string;
  senderId: string;
  readBy: string[];
  createdAt: Date;
  metadata?: {
    inviteId?: string;
  };
}

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

const socket = io(`${process.env.BASE_URL}`, {
  path: "/api/socket",
  transports: ["websocket"],
});

const Chat = ({
  roomId,
  dmId,
  currentUserId,
  messageType,
  otherUserId,
}: {
  roomId?: string;
  dmId?: string;
  currentUserId: string;
  messageType: "user" | "group";
  otherUserId?: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const MESSAGES_PER_PAGE = 50;

  useEffect(() => {
    if (dmId) {
      socket.emit("join_dm", dmId);
    } else if (roomId) {
      socket.emit("join_group", roomId);
    }

    socket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dmId, roomId]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!otherUserId) return;

      try {
        const response = await fetch(`/api/user-details?userId=${otherUserId}`);
        const data = await response.json();

        if (response.ok && data?.user) {
          setOtherUser(data.user);
        } else {
          console.error("Failed to fetch other user data");
        }
      } catch (error) {
        console.error("Error fetching other user:", error);
      }
    };

    fetchOtherUser();
  }, [otherUserId]);

  const fetchMessages = async (page: number, initialLoad = false) => {
    if (isFetching || !hasMoreMessages) return;
    
    const endpoint =
      messageType === "user"
        ? `/api/messages/${dmId}?messageType=user&userId=${currentUserId}&page=${page}`
        : `/api/group-messages/${roomId}?messageType=group&userId=${currentUserId}&page=${page}`;

    setIsFetching(true);
    const response = await fetch(endpoint);
    const data = await response.json();

    if (Array.isArray(data)) {
        if (data.length < MESSAGES_PER_PAGE) {
          setHasMoreMessages(false);
        }
  
        if (initialLoad) {
          setMessages(data);
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
            }
          }, 100);
        } else {
          const previousHeight = chatContainerRef.current?.scrollHeight || 0;
          setMessages((prevMessages) => [...data, ...prevMessages]);
          setTimeout(() => {
            if (chatContainerRef.current) {
              const newHeight = chatContainerRef.current.scrollHeight;
              chatContainerRef.current.scrollTop = newHeight - previousHeight;
            }
          }, 100);
        }
      }
      setLoading(false);
    setIsFetching(false);
  };

  useEffect(() => {
    if (!otherUserId && messageType === "user") {
      console.error("otherUserId is missing for user DM");
      return;
    }
    fetchMessages(page, true);
  }, [roomId, dmId, otherUserId, messageType, currentUserId]);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/invites/${inviteId}/respond-to-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "accept", userId: currentUserId }),
      });
      alert("Invite accepted");
    } catch (error) {
      console.error("Failed to accept invite", error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/invites/${inviteId}/respond-to-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "decline", userId: currentUserId }),
      });
      alert("Invite declined");
    } catch (error) {
      console.error("Failed to decline invite", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData: any = {
      content: newMessage,
      senderId: currentUserId,
      type: messageType,
    };

    if (messageType === "user") {
      messageData.recipientId = otherUserId;
      messageData.dmId = dmId;
    } else {
      messageData.roomId = roomId;
    }

    const endpoint =
      messageType === "user"
        ? `/api/messages/${dmId}?messageType=user`
        : `/api/group-messages/${roomId}?messageType=group`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();
      if (response.ok) {
        socket.emit("send_message", result);
        setNewMessage("");
        scrollToBottom();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current?.scrollTop === 0 && hasMoreMessages && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <CustomLoader />
      </div>
    );
  }

  const bottomPadding = messageType === "group" ? "pb-24" : "pb-4";

  return (
    <div
      className="flex-grow overflow-auto"
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      <div
        ref={messageListRef}
        className={`p-4 ${bottomPadding} flex flex-col space-y-4`}
      >
        {messages.length ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              {msg.senderId !== currentUserId && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-bg2 rounded-full mr-2">
                    {otherUser?.profilePicture ? (
                      <Image
                        src={otherUser.profilePicture}
                        alt={otherUser.username}
                        width={32}
                        height={32}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-600 rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-row items-center">
                      <p className="text-sm text-textcolor pr-4">
                        {otherUser?.username ?? "User"}
                      </p>
                      <p className="text-xs text-icon">
                        {msg?.createdAt
                          ? new Date(msg.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    <div className="bg-bg2 text-textcolor p-2 rounded-xl max-w-xs break-words whitespace-pre-line">
                      {msg.metadata?.inviteId ? (
                        <>
                          <p>{msg.content}</p>
                          <div className="invite-actions flex justify-between mt-2">
                            <button
                              onClick={() =>
                                handleDeclineInvite(msg.metadata!.inviteId!)
                              }
                              className="bg-btn text-danger p-2 rounded-md"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() =>
                                handleAcceptInvite(msg.metadata!.inviteId!)
                              }
                              className="bg-btn text-nav p-2 rounded-md"
                            >
                              Accept
                            </button>
                          </div>
                        </>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              )}
              {msg.senderId === currentUserId && (
                <div className="flex flex-col">
                  <p className="text-xs text-icon">
                    {msg?.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : ""}
                  </p>
                  <div className="bg-darkestcolor text-textcolor p-2 rounded-xl w-fit max-w-xs break-words self-end whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div className="p-4 flex items-center border-t-2 border-bg3 fixed bottom-16 left-0 right-0 h-16 bg-background z-10">
        <textarea
          className="overflow-y-auto w-9/12 resize-none bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 break-words"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={() => {
            handleSendMessage();
            const textarea = document.querySelector("textarea");
            if (textarea) {
              textarea.style.height = "reset";
            }
          }}
          className="bg-btn text-nav p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;