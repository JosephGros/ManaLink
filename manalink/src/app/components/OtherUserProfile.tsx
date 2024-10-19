"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { calculateRequiredXP } from "@/lib/xpConstants";
import CustomLoader from "./CustomLoading";
import BackButton from "./BackBtn";

interface OtherUserProfileComponentProps {
  profileUser: any;
  currentUser: any;
}

const OtherUserProfileComponent = ({
  profileUser,
  currentUser,
}: OtherUserProfileComponentProps) => {
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const checkFriendRequestStatus = () => {
      if (
        currentUser.friendRequestsSent &&
        currentUser.friendRequestsSent.includes(profileUser._id)
      ) {
        setRequestSent(true);
      }
    };
    checkFriendRequestStatus();
  }, [currentUser, profileUser]);

  const sendFriendRequest = async (friendId: string) => {
    setLoading(true);

    try {
      const response = await fetch("/api/friend-request/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser._id,
          recipientId: friendId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Friend request sent!");
        setRequestSent(true);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error sending friend request", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelFriendRequest = async (friendId: string) => {
    setLoading(true);

    try {
      const response = await fetch("/api/friend-request/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser._id,
          recipientId: friendId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Friend request canceled!");
        setRequestSent(false);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error canceling friend request", error);
    } finally {
      setLoading(false);
    }
  };

  const currentXP = profileUser.xp;
  const nextLevelXP = calculateRequiredXP(profileUser.level + 1);
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  const getXPImage = (progressPercentage: number) => {
    if (progressPercentage >= 100) return "/assets/Icons/lvl/XP100.png";
    if (progressPercentage >= 75) return "/assets/Icons/lvl/XP75.png";
    if (progressPercentage >= 50) return "/assets/Icons/lvl/XP50.png";
    if (progressPercentage >= 25) return "/assets/Icons/lvl/XP25.png";
    return "/assets/Icons/lvl/XP00.png";
  };

  const xpImage = getXPImage(progressPercentage);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center rounded-md bg-bg2 w-4/5 max-w-96 p-4">
        {loading && <CustomLoader />}
        <div className="flex flex-row justify-left items-center w-full">
          <BackButton label="Back" className="text-textcolor rounded-md w-12" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div>
            <Image
              src={
                profileUser.profilePicture || "/assets/profile-pics/mtg.webp"
              }
              alt="Profile picture"
              width={160}
              height={160}
              className="w-40 h-40 rounded-full object-cover mb-4"
            />
          </div>
          <h1 className="font-bold text-textcolor text-2xl truncate max-w-72">
            {profileUser.username}
          </h1>
          <p className="text-textcolor text-md pb-4">#{profileUser.userCode}</p>
          <div className="flex justify-center">
            <div className="flex flex-row mb-4">
              <Image
                src={xpImage}
                alt="XP Level"
                width={23}
                height={23}
                className="mr-2"
              />
              <div className="w-64 bg-progressbar rounded-md h-6 relative shadow-md">
                <div
                  className="bg-btn h-6 rounded-l-md flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-nav">
                    Lvl {profileUser.level} - {currentXP}/{nextLevelXP} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="mt-4 font-bold text-textcolor text-lg">
              <div className="flex items-center mb-5 ml-2">
                <Image
                  src="/assets/Icons/IconColor/users.png"
                  alt="Friends Icon"
                  width={28}
                  height={28}
                  className="mr-4"
                />
                <a href={`/friend/friendList?userId=${profileUser._id}`} className="text-base font-bold">
                  {profileUser.friends.length} - Friends
                </a>
              </div>
              <div className="flex items-center mb-5 ml-2">
                <Image
                  src="/assets/Icons/IconColor/trophy-star.png"
                  alt="Achievements Icon"
                  width={28}
                  height={28}
                  className="mr-4"
                />
                <a href="" className="text-base font-bold">
                  {profileUser.achievements.length} - Achievements
                </a>
              </div>
              <div className="flex items-center mb-5 ml-2">
                <Image
                  src="/assets/Icons/IconColor/dice-d20_1.png"
                  alt="Playgroups Icon"
                  width={28}
                  height={28}
                  className="mr-4"
                />
                <a href="" className="text-base font-bold">
                  {profileUser.playgroups.length} - Playgroups
                </a>
              </div>
              <div className="flex items-center mb-5 ml-2">
                <Image
                  src="/assets/Icons/IconColor/medal.png"
                  alt="Wins Icon"
                  width={28}
                  height={28}
                  className="mr-4"
                />
                <a href="" className="text-base font-bold">
                  {profileUser.gamesWon} - Wins
                </a>
              </div>
              <div className="flex items-center mb-5 ml-2">
                <Image
                  src="/assets/Icons/IconColor/book-dead12.png"
                  alt="Games Played Icon"
                  width={28}
                  height={28}
                  className="mr-4"
                />
                <a href="" className="text-base font-bold">
                  {profileUser.gamesPlayed} - Games Played
                </a>
              </div>
            </div>
            {!requestSent ? (
              <button
                onClick={() => sendFriendRequest(profileUser._id)}
                className="bg-btn text-nav font-bold px-4 py-2 mt-4 rounded-md"
              >
                Send Friend Request
              </button>
            ) : (
              <button
                onClick={() => cancelFriendRequest(profileUser._id)}
                className="bg-btn text-danger font-bold px-4 py-2 mt-4 rounded-md"
              >
                Cancel Friend Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfileComponent;