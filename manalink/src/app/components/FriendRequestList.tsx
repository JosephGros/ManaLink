"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import sadFace from "../../../public/assets/Icons/IconColor/sad-tear.png";
import CustomLoader from "./CustomLoading";
import BackButton from "./BackBtn";

const FriendRequestList = () => {
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"received" | "sent">("received");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/friend-request");
        const currentUser = await fetch("/api/user-profile");
        const data = await response.json();
        const currentUserData = await currentUser.json();
        console.log("Request DATA : ", data);

        setReceivedRequests(data.received);
        setSentRequests(data.sent);
        setCurrentUserId(currentUserData.user._id);

        console.log("Received Requests: ", data.received);
        console.log("Sent Requests: ", data.sent);
        console.log("Sent Requests: ", currentUserData.user._id);
      } catch (error) {
        console.error("Error fetching friend requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (senderId: string) => {
    try {
      const response = await fetch("/api/friend-request/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId, friendId: senderId }),
      });
      const data = await response.json();
      if (data.success) {
        setReceivedRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        );
      }
    } catch (error) {
      console.error("Error accepting friend request", error);
    }
  };

  const handleDecline = async (senderId: string) => {
    try {
      const response = await fetch("/api/friend-request/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId, friendId: senderId }),
      });
      const data = await response.json();
      if (data.success) {
        setReceivedRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        );
      }
    } catch (error) {
      console.error("Error declining friend request", error);
    }
  };

  const handleCancel = async (recipientId: string) => {
    try {
      const response = await fetch("/api/friend-request/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientId }),
      });
      const data = await response.json();
      if (data.success) {
        setSentRequests((prev) =>
          prev.filter((request) => request.recipientId !== recipientId)
        );
      }
    } catch (error) {
      console.error("Error canceling friend request", error);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="container mx-auto p-4 text-textcolor">
      <div className="fixed top-0 left-0 right-0 h-32 p-2 w-full bg-background flex justify-center items-center z-10 border-b-2 border-bg3">
        <BackButton
          label="Back"
          className="fixed left-2 top-2 text-textcolor rounded-md w-12 flex items-center"
        />
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-4">
            Friend Requests
          </h1>
          <div className="mb-4">
            <button
              className={`mr-4 px-4 py-2 bg-btn text-nav rounded-md font-bold ${
                viewType === "received" ? "ring-2 ring-icon" : ""
              }`}
              onClick={() => setViewType("received")}
            >
              Received Requests
            </button>
            <button
              className={`px-4 py-2 bg-btn text-nav rounded-md font-bold ${
                viewType === "sent" ? "ring-2 ring-icon" : ""
              }`}
              onClick={() => setViewType("sent")}
            >
              Sent Requests
            </button>
          </div>
        </div>
      </div>

      {viewType === "received" ? (
        <div className="fixed top-32 left-0 right-0 bottom-20 pt-4 flex flex-col items-center mx-2 overflow-auto flex-grow">
          <h2 className="text-xl font-bold text-center mb-4">
            Received Requests
          </h2>
          {receivedRequests.length === 0 ? (
            <p>
              No received friend requests. Nobody wants to be your friend
              <Image
                src={sadFace}
                alt="Sad face"
                width={24}
                height={24}
                className="ml-2 inline-block"
              />
            </p>
          ) : (
            <ul className="flex flex-col items-center sm:w-2/4">
              {receivedRequests.map((request) => (
                <li
                  key={request.senderId}
                  className="flex items-center justify-between p-2 bg-bg2 rounded-lg my-1 shadow-md h-18 w-full"
                >
                  <div className="grid grid-cols-8 gap-x-1 flex items-center w-full">
                    <div className="flex flex-col justify-center items-center col-span-1 w-18">
                      <div className="flex-shrink-0 w-12 h-12 bg-background rounded-full flex items-center justify-center">
                        <Image
                          src={
                            request.userInfo.profilePicture ||
                            "/assets/profile-pics/default.webp"
                          }
                          alt="User Avatar"
                          width={48}
                          height={48}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-textcolor text-center mt-1">
                        lvl {request.userInfo.level}
                      </p>
                    </div>
                    <div className="col-span-4 ml-2">
                      <p className="font-bold text-xl text-textcolor truncate max-w-44">
                        {request.userInfo.username}
                      </p>
                      <p className="text-xs text-textcolor">
                        Sent: {new Date(request.dateSent).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-3 flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 bg-btn text-nav rounded-md font-bold"
                        onClick={() => handleAccept(request.senderId)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 bg-btn text-danger rounded-md font-bold"
                        onClick={() => handleDecline(request.senderId)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="fixed top-32 left-0 right-0 bottom-20 pt-4 flex flex-col items-center mx-2 overflow-auto flex-grow">
          <h2 className="text-xl font-bold text-center mb-4">Sent Requests</h2>
          <ul className="flex flex-col items-center sm:w-2/4">
            {sentRequests.map((request) => (
              <li
                key={request.recipientId}
                className="flex items-center justify-between p-2 bg-bg2 rounded-lg my-1 shadow-md h-18 w-full"
              >
                <div className="grid grid-cols-8 gap-x-1 flex items-center w-full">
                  <div className="flex flex-col justify-center items-center col-span-1 w-18">
                    <div className="flex-shrink-0 w-12 h-12 bg-background rounded-full flex items-center justify-center">
                      <Image
                        src={
                          request.userInfo.profilePicture ||
                          "/assets/profile-pics/default.webp"
                        }
                        alt="User Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-textcolor text-center mt-1">
                      lvl {request.userInfo.level}
                    </p>
                  </div>
                  <div className="col-span-4 ml-2">
                    <p className="font-bold text-xl text-textcolor truncate max-w-44">
                      {request.userInfo.username}
                    </p>
                    <p className="text-xs text-textcolor">
                      Sent: {new Date(request.dateSent).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-3 flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 bg-btn text-danger rounded-md font-bold"
                      onClick={() => handleCancel(request.recipientId)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendRequestList;