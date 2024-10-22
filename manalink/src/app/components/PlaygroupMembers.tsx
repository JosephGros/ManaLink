"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomLoader from "./CustomLoading";
import moderatorIcon from "../../../public/assets/Icons/IconColor/joker.png";
import adminIcon from "../../../public/assets/Icons/IconColor/crown2.png";
import BackButton from "./BackBtn";
import addFriendIcon from "../../../public/assets/Icons/NavColor/shield-plus3.png";
import removeFriendIcon from "../../../public/assets/Icons/NavColor/shield-check.png";
import pendingIcon from "../../../public/assets/Icons/NavColor/duration-alt (1).png";
import RemoveFriendPopup from "./RemoveFriendPopup";
import meIcon from "../../../public/apple-touch-icon.png";

interface PlaygroupMember {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
  isAdmin?: boolean;
  isModerator?: boolean;
  playgroups: string[];
}

interface Friend {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
  playgroups: string[];
}

const PlaygroupMembersList = ({ playgroupId }: { playgroupId: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [membersList, setMembersList] = useState<PlaygroupMember[]>([]);
  const [searchResults, setSearchResults] = useState<PlaygroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [manageMessage, setManageMessage] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/playgroups/${playgroupId}/members`);
        const data = await response.json();
        setMembersList(data.members);
      } catch (error) {
        console.error("Error fetching playgroup members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [playgroupId]);

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

  //   const handleSearch = async () => {
  //     setLoading(true);
  //     try {
  //       const query = new URLSearchParams({
  //         username: searchInput,
  //       }).toString();

  //       const response = await fetch(`/api/search-users?${query}`);
  //       const data = await response.json();
  //       setSearchResults(data);
  //     } catch (error) {
  //       console.error("Error searching users:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <div className="text-textcolor">
      {loading && (
        <div className="flex justify-center">
          <CustomLoader />
        </div>
      )}
      <div className="mt-4 flex flex-col justify-center items-center">
        <div className="fixed top-0 left-0 right-0 h-20 p-2 w-full bg-background flex justify-center items-center z-10 border-b-2 border-bg3">
          <BackButton
            label="Back"
            className="fixed left-4 text-textcolor rounded-md w-12 flex items-center"
          />
          <h2 className="text-3xl font-bold">Playgroup Members</h2>
        </div>
        <div className="fixed top-20 left-0 right-0 bottom-20 pt-4 flex flex-col items-center mx-2 overflow-auto flex-grow">
          <div className="flex flex-wrap justify-center w-3/4">
            {membersList.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-2 bg-bg2 mx-2 rounded-lg my-1 shadow-md h-18 w-64"
              >
                <div className="flex flex-row justify-center justify-between items-center w-full">
                  <div className="flex flex-col justify-center items-center w-18">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                      <Image
                        src={member.profilePicture}
                        alt="Member Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-32">
                    <p className="font-bold text-xl text-textcolor truncate">
                      <a
                        href={`/otherUserProfile/${member._id}?userId=${member._id}`}
                        className="flex flex-row items-center"
                      >
                        {member.username}
                        {member.isAdmin && (
                          <Image
                            src={adminIcon}
                            alt="Admin"
                            width={20}
                            height={20}
                            className="ml-2 inline-block h-full"
                          />
                        )}
                        {member.isModerator && (
                          <Image
                            src={moderatorIcon}
                            alt="Moderator"
                            width={20}
                            height={20}
                            className="ml-2 inline-block h-full"
                          />
                        )}
                      </a>
                    </p>
                    <p className="text-xs text-start text-textcolor text-center mt-1">
                      lvl {member.level}
                    </p>
                  </div>
                  <div className="w-16 h-14 flex justify-center items-center">
                    {isFriend(member._id) ? (
                      <button
                        onClick={() => {
                          setSelectedFriend(member);
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
                    ) : isPending(member._id) ? (
                      <button
                        onClick={() => handleCancelRequest(member._id)}
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
                    ) : isCurrentUser(member._id) ? (
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
                        onClick={() => handleAddFriend(member._id)}
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
                  {showRemovePopup && selectedFriend && (
                    <RemoveFriendPopup
                      friendName={selectedFriend.username}
                      onConfirm={() => {
                        handleRemoveFriend(selectedFriend._id);
                        setShowRemovePopup(false);
                      }}
                      onCancel={() => setShowRemovePopup(false)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroupMembersList;