import React from "react";
import Chat from "@/app/components/Chat";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { fetchPlaygroupData } from "@/lib/fetchPlaygroupData";
import BackButton from "@/app/components/BackBtn";

const JWT_SECRET: any = process.env.JWT_SECRET;

const PlaygroupChatPage = async ({
  params,
  searchParams,
}: {
  params: { playgroupId: string };
  searchParams: { playgroup: string };
}) => {
  const { playgroupId } = params;
  const { playgroup } = searchParams;

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>No token found, please log in.</div>;
  }

  let currentUserId;
  let playgroupName;
  playgroupName = await fetchPlaygroupData(token, playgroupId);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    currentUserId = (decoded as any).id;
  } catch (error) {
    return <div>Invalid token, please log in again.</div>;
  }

  return (
    <div className="">
      <div className="fixed top-0 left-0 right-0 h-14 w-full bg-background flex justify-center items-center z-10 border-b-2 border-bg3">
      <BackButton
        label="Back"
        className="fixed left-4 text-textcolor rounded-md w-12 flex items-center"
      />
        <h1 className="text-3xl font-bold text-center text-textcolor">
          {playgroupName.playgroup.playgroupname}
        </h1>
      </div>
      <div className="fixed top-14 left-0 right-0 bottom-36">
        <div className="w-full h-full flex flex-col overflow-auto">
          <Chat
            roomId={playgroupId}
            currentUserId={currentUserId}
            messageType="group"
          />
        </div>
      </div>
    </div>
  );
};

export default PlaygroupChatPage;