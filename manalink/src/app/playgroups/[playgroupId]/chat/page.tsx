import React from "react";
import Chat from "@/app/components/Chat";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET: any = process.env.JWT_SECRET;

const PlaygroupChatPage = async ({
  params,
}: {
  params: { playgroupId: string };
}) => {
  const { playgroupId } = params;

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
      <h1>Playgroup Chat</h1>
      <Chat
        roomId={playgroupId}
        currentUserId={currentUserId}
        messageType="group"
      />
    </div>
  );
};

export default PlaygroupChatPage;