"use client";

import Image from "next/image";
import admin from "../../../public/assets/Icons/IconColor/crown2.png";
import addFriendIcon from "../../../public/assets/Icons/IconColor/shield-plus.png";
import CustomLoader from "./CustomLoading";
import moderatorIcon from "../../../public/assets/Icons/IconColor/joker.png";
import adminIcon from "../../../public/assets/Icons/IconColor/crown2.png";
import BackButton from "./BackBtn";
import removeFriendIcon from "../../../public/assets/Icons/NavColor/shield-check.png";
import pendingIcon from "../../../public/assets/Icons/NavColor/duration-alt (1).png";
import RemoveFriendPopup from "./RemoveFriendPopup";
import meIcon from "../../../public/apple-touch-icon.png";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminProfileCardProps {
  user: {
    _id: string;
    username: string;
    level: number;
    profilePicture: string;
  };
  currentUserId: string;
}

interface Friend {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
  playgroups: string[];
}

export default function PlaygroupAdminCard({
  user,
  currentUserId,
}: AdminProfileCardProps) {
  const isAdmin = user._id === currentUserId;

  const [userId, setUserId] = useState("");
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [manageMessage, setManageMessage] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user-profile`);
        const data = await response.json();
        setUserId(data.user._id);
        setFriendsList(data.user.friends);
        setPendingRequests(data.user.friendRequestsSent || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friend-request/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId: userId, recipientId: friendId }),
      });

      const data = await response.json();
      if (data.success) {
        setManageMessage("Friend request sent!");
        setPendingRequests((prev) => [...prev, friendId]);
      } else {
        setManageMessage(data.message || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setManageMessage("Failed to send friend request");
    }
  };

  const handleCancelRequest = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friend-request/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId: userId, recipientId: friendId }),
      });

      const data = await response.json();
      if (data.success) {
        setManageMessage("Friend request canceled!");
        setPendingRequests((prev) => prev.filter((id) => id !== friendId));
      } else {
        setManageMessage(data.message || "Failed to cancel friend request");
      }
    } catch (error) {
      console.error("Error canceling friend request:", error);
      setManageMessage("Failed to cancel friend request");
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friend-request/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, friendId }),
      });

      const data = await response.json();
      if (data.success) {
        setManageMessage("Friend removed!");
        setFriendsList((prev) => prev.filter((id) => id !== friendId));
      } else {
        setManageMessage(data.message || "Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      setManageMessage("Failed to remove friend");
    }
  };

  const isFriend = (friendId: string) => {
    return friendsList.includes(friendId);
  };

  const isPending = (friendId: string) => {
    return pendingRequests.includes(friendId);
  };

  const isCurrentUser = (friendId: string) => {
    return userId === friendId;
  };

  return (
    <div className="flex flex-col items-center justify-between p-2 bg-bg2 rounded-lg my-1 shadow-md h-18 w-96">
      <p className="text-xl underline underline-offset-4 font-bold text-textcolor">
        Admin
      </p>
      <Link
        key={user.level}
        href={`/otherUserProfile/${user._id}?userId=${user._id}`}
      >
        <div className="flex flex-col items-center justify-between p-2 bg-bg3 rounded-lg m-4 shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)] h-18 w-11/12 hover:ring-2 ring-icon">
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
                {isFriend(user._id) ? (
                  <button
                    onClick={() => {
                      setShowRemovePopup(true);
                    }}
                    className="bg-btn text-danger w-12 h-8 rounded-lg flex justify-center items-center"
                  >
                    <Image
                      src={removeFriendIcon}
                      alt="Remove Friend"
                      width={25}
                      height={25}
                      className="w-6 h-6"
                    />
                  </button>
                ) : isPending(user._id) ? (
                  <button
                    onClick={() => handleCancelRequest(user._id)}
                    className="bg-btn text-danger w-12 h-8 rounded-lg flex justify-center items-center"
                  >
                    <Image
                      src={pendingIcon}
                      alt="Pending"
                      width={25}
                      height={25}
                      className="w-6 h-6"
                    />
                  </button>
                ) : isCurrentUser(user._id) ? (
                  <div className="rounded-lg shadow-lg h-10 w-10 flex justify-center items-center">
                    <Image
                      src={meIcon}
                      alt="Me Icon"
                      width={40}
                      height={40}
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddFriend(user._id)}
                    className="bg-btn text-danger w-12 h-8 rounded-lg flex justify-center items-center"
                  >
                    <Image
                      src={addFriendIcon}
                      alt="Add Friend"
                      width={25}
                      height={25}
                      className="w-6 h-6"
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}