"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomLoader from "./CustomLoading";
import closeIcon from "../../../public/assets/Icons/IconColor/cross-circle.png";
import addFriendIcon from "../../../public/assets/Icons/NavColor/shield-plus3.png";
import removeFriendIcon from "../../../public/assets/Icons/NavColor/shield-check.png";
import pendingIcon from "../../../public/assets/Icons/NavColor/duration-alt (1).png";
import meIcon from "../../../public/apple-touch-icon.png";

interface Attendee {
  userId: string;
  username: string;
  level: number;
  profilePicture: string;
  status: "yes" | "no" | "pending";
}

interface BookingPopupProps {
  bookingId: string;
  onClose: () => void;
}

interface Friend {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
  playgroups: string[];
}

const BookingAttendeesPopup = ({ bookingId, onClose }: BookingPopupProps) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"yes" | "no" | "pending">("yes");
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [userId, setUserId] = useState("");
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [manageMessage, setManageMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/attendees?bookingId=${bookingId}`);
        const data = await response.json();
        setAttendees(data.attendees);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [bookingId]);

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

  const filteredAttendees = attendees.filter(
    (attendee) => attendee.status === activeTab
  );

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full m-6 sm:w-3/4 lg:w-1/2 bg-bg2 p-2 rounded-lg shadow-lg h-96 flex flex-col items-center">
        <div className="flex justify-between items-center mb-2 w-full">
          <h2 className="text-2xl font-bold text-textcolor w-80 sm:w-full text-center">
            Who's coming?
          </h2>
          <button onClick={onClose} className="text-textcolor">
            <Image src={closeIcon} alt="Close" width={24} height={24} />
          </button>
        </div>
        <div className="flex justify-around mb-2 w-11/12">
          <button
            className={`py-2 px-4 ${
              activeTab === "yes"
                ? "border-b-2 border-lightaccent font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("yes")}
          >
            Coming
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "no"
                ? "border-b-2 border-lightaccent font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("no")}
          >
            Not Coming
          </button>
          {/* <button
            className={`py-2 px-4 ${
                activeTab === "pending" ? "border-b-2 border-lightaccent" : ""
                }`}
                onClick={() => setActiveTab("pending")}
                >
                Pending
                </button> */}
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <CustomLoader />
          </div>
        ) : filteredAttendees.length > 0 ? (
          <div className="overflow-y-auto h-72 w-full py-4 rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
            <div className="flex flex-wrap justify-center items-center box-border rounded-md">
              {filteredAttendees.map((attendee) => (
                <div
                  key={attendee.userId}
                  className="flex flex-row items-center justify-between p-2 bg-bg3 m-2 rounded-lg my-1 shadow-md h-18 w-72"
                >
                  <div className="flex items-center">
                    <Image
                      src={attendee.profilePicture}
                      alt="Attendee Avatar"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-xl text-textcolor truncate">
                        {attendee.username}
                      </p>
                      <p className="text-xs text-textcolor">
                        lvl {attendee.level}
                      </p>
                    </div>
                  </div>
                  {isFriend(attendee.userId) ? (
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
                  ) : isPending(attendee.userId) ? (
                    <button
                      onClick={() => handleCancelRequest(attendee.userId)}
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
                  ) : isCurrentUser(attendee.userId) ? (
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
                      onClick={() => handleAddFriend(attendee.userId)}
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
              ))}
            </div>
          </div>
        ) : (
          <p className="text-textcolor font bold flex justify-center items-center h-full">
            Nobody's home
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingAttendeesPopup;