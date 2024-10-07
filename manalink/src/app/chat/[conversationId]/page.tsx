import React from "react";
import Chat from "@/app/components/Chat";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET: any = process.env.JWT_SECRET;

const DMChatPage = async ({
    params,
    searchParams,
  }: {
    params: { conversationId: string };
    searchParams: { otherUserId: string };
  }) => {
    const { conversationId } = params;
    const { otherUserId } = searchParams;

  console.log('Im conversation ID : ', conversationId);
  console.log('Im the other user : ', otherUserId);

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>No token found, please log in.</div>;
  }

  let currentUserId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    currentUserId = (decoded as any).id;
  } catch (error) {
    return <div>Invalid token, please log in again.</div>;
  }

  return (
    <div>
      <h1>Direct Message Chat</h1>
      <Chat
        dmId={conversationId}
        currentUserId={currentUserId}
        otherUserId={otherUserId}
        messageType="user"
      />
    </div>
  );
};

export default DMChatPage;