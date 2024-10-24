"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { calculateRequiredXP } from "@/lib/xpConstants";
import CustomLoader from "./CustomLoading";
import BackButton from "./BackBtn";
import RemoveFriendPopup from "./RemoveFriendPopup";
import addFriendIcon from "../../../public/assets/Icons/NavColor/shield-plus3.png";
import removeFriendIcon from "../../../public/assets/Icons/NavColor/shield-check.png";
import pendingIcon from "../../../public/assets/Icons/NavColor/duration-alt (1).png";
import sendIcon from "../../../public/assets/Icons/NavColor/paper-plane2.png";
import { useRouter } from "next/navigation";
import ProfileMessagePopup from "./ProfileMessagePopup";

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
  const [isFriend, setIsFriend] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const checkFriendStatus = () => {
      if (
        currentUser.friendRequestsSent &&
        currentUser.friendRequestsSent.includes(profileUser._id)
      ) {
        setRequestSent(true);
      }

      if (
        currentUser.friends &&
        currentUser.friends.includes(profileUser._id)
      ) {
        setIsFriend(true);
      }
    };
    checkFriendStatus();
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

  const removeFriend = async (friendId: string) => {
    setLoading(true);

    try {
      const response = await fetch("/api/friend-request/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          friendId: friendId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFriend(false);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error removing friend", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (firstMessage: string) => {
    try {
      const response = await fetch(`/api/dm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser._id,
          recipientId: profileUser._id,
          firstMessage,
        }),
      });

      if (response.ok) {
        const { dmId } = await response.json();
        router.push(
          `/chat/${dmId}?otherUserId=${profileUser._id}&otherUsername=${profileUser.username}`
        );
      } else {
        console.error("Failed to start new DM");
      }
    } catch (error) {
      console.error("Error starting new DM:", error);
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
                <a
                  href={`/friend/friendList?userId=${profileUser._id}`}
                  className="text-base font-bold"
                >
                  {profileUser.friends.length} - Friends
                </a>
              </div>
              <div className="flex items-center mb-5 ml-2">
                  <Image
                    src="/assets/Icons/IconColor/card-heart.png"
                    alt="Decks Icon"
                    width={28}
                    height={28}
                    className="mr-4"
                  />
                  <a href="/decks" className="text-base font-bold">
                    {profileUser.decks.length || 0} - Decks
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
            <div className="flex flex-row justify-evenly">
                {!isFriend ? (
                requestSent ? (
                    <button
                    onClick={() => cancelFriendRequest(profileUser._id)}
                    className="bg-btn p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
                    >
                    <Image
                        src={pendingIcon}
                        alt="Pending"
                        width={25}
                        height={25}
                        className="w-6 h-6"
                    />
                    </button>
                ) : (
                    <button
                    onClick={() => sendFriendRequest(profileUser._id)}
                    className="bg-btn p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
                    >
                    <Image
                        src={addFriendIcon}
                        alt="Add Friend"
                        width={25}
                        height={25}
                        className="w-6 h-6"
                    />
                    </button>
                )
                ) : (
                <button
                    onClick={() => setShowRemovePopup(true)}
                    className="bg-btn p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
                >
                    <Image
                    src={removeFriendIcon}
                    alt="Remove Friend"
                    width={25}
                    height={25}
                    className="w-6 h-6"
                    />
                </button>
                )}

                <button
                onClick={() => setShowMessagePopup(true)}
                className="bg-btn p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
                >
                <Image
                    src={sendIcon}
                    alt="Remove Friend"
                    width={25}
                    height={25}
                    className="w-6 h-6"
                />
                </button>
            </div>

            {showMessagePopup && (
              <ProfileMessagePopup
                onClose={() => setShowMessagePopup(false)}
                onSend={handleStartChat}
              />
            )}

            {showRemovePopup && (
              <RemoveFriendPopup
                friendName={profileUser.username}
                onConfirm={() => {
                  removeFriend(profileUser._id);
                  setShowRemovePopup(false);
                }}
                onCancel={() => setShowRemovePopup(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfileComponent;
