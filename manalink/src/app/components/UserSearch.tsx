"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomLoader from "./CustomLoading";
import searchIcon from "../../../public/assets/Icons/NavColor/search3.png";
import friendsIcon from "../../../public/assets/Icons/IconColor/users.png";
import addFriendIcon from "../../../public/assets/Icons/NavColor/shield-plus3.png";
import removeFriendIcon from "../../../public/assets/Icons/NavColor/shield-check.png";
import pendingIcon from "../../../public/assets/Icons/NavColor/duration-alt (1).png";
import playgroupIcon from "../../../public/assets/Icons/IconColor/dice-d20_1.png";
import RemoveFriendPopup from "./RemoveFriendPopup";
import BackButton from "./BackBtn";

interface Friend {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
  playgroups: string[];
}

const UserSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
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

  console.log("FRIENDS LIST : ", friendsList);
  const handleSearch = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        username: searchInput,
      }).toString();

      const response = await fetch(`/api/search-users?${query}`);
      const data = await response.json();
      const filteredResults = data.filter(
        (user: Friend) => user._id !== userId
      );
      setSearchResults(filteredResults);
      console.log(searchResults);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="p-2 text-textcolor">
      <div className="w-full flex items-center justify-center">
      <div className="fixed top-0 left-0 right-0 h-24 p-2 w-full bg-background flex justify-center items-center z-10 border-b-2 border-bg3">
      <BackButton
        label="Back"
        className="fixed left-2 text-textcolor rounded-md w-12 flex items-center"
      />
        <div className="w-11/12 max-w-96 flex items-center justify-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Username#UserCode"
            className="w-72 h-10 mr-2 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor placeholder:opacity-50 text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
          />
          <button
            onClick={handleSearch}
            className="bg-btn p-2 rounded-md shadow-lg h-10 w-10"
          >
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </button>
        </div>
      </div>
      </div>
      {loading && (
        <div className="flex justify-center">
          <CustomLoader />
        </div>
      )}
      <div className="fixed top-24 left-0 right-0 bottom-20 pt-4 flex flex-col items-center mx-2">
        {searchResults.map((user) => {
          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 bg-bg2 rounded-lg my-1 shadow-md h-18 w-11/12 sm:w-3/4"
            >
              <div className="grid grid-rows-2 sm:grid-rows-1 grid-cols-9 gap-x-1 flex items-center w-full">
                <div className="flex flex-col justify-center items-center row-start-1 row-span-2 col-start-1 col-span-2 w-18 sm:col-span-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-background rounded-full flex items-center justify-center">
                    <Image
                      src={user.profilePicture}
                      alt="User Avatar"
                      width={25}
                      height={25}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-textcolor text-center mt-1">
                    lvl {user.level}
                  </p>
                </div>
                <div className="col-start-3 col-end-8 row-start-1 row-span-1 sm:row-start-1 sm:row-span-1 sm:col-start-2 sm:col-end-5">
                  <div className="flex flex-row sm:flex-col items-center sm:items-start">
                    <p className="font-bold text-xl text-textcolor truncate max-w-44">
                      {user.username}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row sm:justify-center items-center col-start-3 col-span-2 row-start-2 row-span-2 sm:row-start-1 sm:row-span-1 sm:col-start-6 sm:col-span-1">
                  <Image
                    src={friendsIcon}
                    alt="User Avatar"
                    width={25}
                    height={25}
                    className="w-6 h-6 object-cover"
                  />
                  <p className="text-textcolor text-start pl-2 sm:text-center sm:pl-0 text-xs w-full">
                    {user.friends.length}
                  </p>
                </div>
                <div className="flex flex-row sm:justify-center items-center col-start-5 col-span-2 row-start-2 row-span-2 sm:row-start-1 sm:row-span-1 sm:col-start-7 sm:col-span-1">
                  <Image
                    src={playgroupIcon}
                    alt="User Avatar"
                    width={25}
                    height={25}
                    className="w-6 h-6 object-cover"
                  />
                  <p className="text-textcolor text-start pl-2 sm:text-center sm:pl-0 text-xs w-full">
                    {user.playgroups.length}
                  </p>
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  {isFriend(user._id) ? (
                    <button
                      onClick={() => {
                        setSelectedFriend(user);
                        setShowRemovePopup(true);
                      }}
                      className="bg-btn px-4 py-1 rounded-lg"
                    >
                      <Image
                        src={removeFriendIcon}
                        alt="Remove Friend"
                        width={25}
                        height={25}
                      />
                    </button>
                  ) : isPending(user._id) ? (
                    <button
                      onClick={() => handleCancelRequest(user._id)}
                      className="bg-btn px-4 py-1 rounded-lg"
                    >
                      <Image
                        src={pendingIcon}
                        alt="Pending"
                        width={25}
                        height={25}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(user._id)}
                      className="bg-btn px-4 py-1 rounded-lg"
                    >
                      <Image
                        src={addFriendIcon}
                        alt="Add Friend"
                        width={25}
                        height={25}
                      />
                    </button>
                  )}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSearch;