"use client";
import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import io from "socket.io-client";

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

const socket = io({
    path: '/api/socket',
    transports: ['websocket'],
  })

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
    
    useEffect(() => {
        if (dmId) {
          socket.emit('join_dm', dmId);
        } else if (roomId) {
          socket.emit('join_group', roomId);
        }
    
        socket.on("receive_message", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });
    
        return () => {
          socket.off('receive_message');
        };
      }, [dmId, roomId]);

    useEffect(() => {
      const fetchMessages = async () => {
        if (!otherUserId && messageType === "user") {
          console.error("otherUserId is missing for user DM");
          return;
        }
  
        const endpoint =
          messageType === "user"
            ? `/api/messages/${dmId}?messageType=user&userId=${currentUserId}`
            : `/api/group-messages/${roomId}?messageType=group&userId=${currentUserId}`;
  
        const response = await fetch(endpoint);
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Data returned is not an array:", data);
        }
        setLoading(false);
      };
  
      fetchMessages();
    }, [roomId, dmId, otherUserId, messageType, currentUserId]);
  
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
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };
  
    if (loading) {
      return <p>Loading messages...</p>;
    }
  
    return (
      <div className="chat-container">
        <div className="messages">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg: Message, index: number) => (
              <ChatMessage key={index} message={msg} currentUserId={currentUserId} />
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  };
  
  export default Chat;  