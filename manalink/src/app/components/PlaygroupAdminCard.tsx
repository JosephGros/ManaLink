"use client";

import Image from "next/image";
import admin from "../../../public/assets/Icons/IconColor/crown2.png";
import addFriendIcon from "../../../public/assets/Icons/IconColor/shield-plus.png";
import Link from "next/link";

interface AdminProfileCardProps {
  user: {
    _id: string;
    username: string;
    level: number;
    profilePicture: string;
  };
  currentUserId: string;
}

export default function PlaygroupAdminCard({ user, currentUserId, }: AdminProfileCardProps) {

    const isAdmin = user._id === currentUserId;

  return (
    <div className="flex flex-col items-center justify-between p-2 bg-bg2 rounded-lg my-1 shadow-md h-18 w-96">
      <p className="text-xl underline underline-offset-4 font-bold text-textcolor">
        Admin
      </p>
      <Link
        key={user.level}
        href={`/otherUserProfile/${user._id}?userId=${user._id}`}
      >
        <div  className="flex flex-col items-center justify-between p-2 bg-bg3 rounded-lg m-4 shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)] h-18 w-11/12 hover:ring-2 ring-icon">
            <div className="grid grid-cols-5 gap-x-1 flex items-center w-full">
            <div className="flex flex-col justify-center items-center col-start-1 col-span-1 w-18">
                <div className="flex-shrink-0 w-14 h-14 bg-background rounded-full flex items-center justify-center">
                <Image
                    src={user.profilePicture}
                    alt="User Avatar"
                    width={25}
                    height={25}
                    className="w-full h-full rounded-full object-cover"
                />
                </div>
            </div>
            <div className="col-start-2 col-end-4 sm:ml-4">
                <div className="flex flex-row items-center sm:items-start">
                <p className="font-bold text-xl text-textcolor truncate max-w-44 mr-2">
                    {user.username}
                </p>
                <Image
                    src={admin}
                    alt="Admin Icon"
                    width={25}
                    height={25}
                    className="w-5 h-5 object-cover self-center"
                />
                </div>
                <p className="text-xs text-textcolor text-center mt-1 text-start">
                lvl {user.level}
                </p>
            </div>
            {!isAdmin && (
              <div className="flex flex-row items-center col-start-5">
                <Image
                  src={addFriendIcon}
                  alt="Add Friend"
                  width={25}
                  height={25}
                  className="w-9 h-9 object-cover"
                />
              </div>
            )}
            </div>
        </div>
      </Link>
    </div>
  );
}