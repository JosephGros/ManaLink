"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomLoader from "./CustomLoading";
import searchIcon from "../../../public/assets/Icons/NavColor/search3.png";
import playgroupIcon from "../../../public/assets/Icons/IconColor/dice-d20_1.png";
import playgroupInvite from "../../../public/assets/Icons/NavColor/add_1.png";
import retractInviteIcon from "../../../public/assets/Icons/NavColor/check-circle_1.png";
import member from "../../../public/apple-touch-icon.png";
import friendsIcon from "../../../public/assets/Icons/IconColor/users.png";
import addFriend from "../../../public/assets/Icons/IconColor/shield-plus.png";
import removeFriend from "../../../public/assets/Icons/IconColor/shield-check_1.png";

interface User {
  _id: string;
  username: string;
  userCode: string;
  playgroups: string;
  xp: number;
  level: number;
  profilePicture: string;
  friends: string;
}

const UserSearch = ({
  inviterId,
  playgroupId,
}: {
  inviterId: string;
  playgroupId: string;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [inviteStatuses, setInviteStatuses] = useState<{
    [key: string]: string;
  }>({});
  const [playgroupMembers, setPlaygroupMembers] = useState<string[]>([]);

  const handleSearch = async () => {
    setLoading(true);

    let username = "";
    let userCode = "";

    if (searchInput.includes("#")) {
      [username, userCode] = searchInput.split("#");
    } else {
      username = searchInput;
    }

    try {
      const membersResponse = await fetch(
        `/api/playgroups/${playgroupId}/members`
      );
      const membersData = await membersResponse.json();
      setPlaygroupMembers(membersData);

      const query = new URLSearchParams({
        ...(username && { username }),
        ...(userCode && { userCode }),
        currentUserId: inviterId,
      }).toString();

      const response = await fetch(`/api/search-users?${query}`);
      const data = await response.json();
      setSearchResults(data);

      const statuses: { [key: string]: string } = {};
      for (const user of data) {
        const statusResponse = await fetch(
          `/api/playgroups/${playgroupId}/check-invite`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inviteeId: user._id }),
          }
        );

        const statusData = await statusResponse.json();
        statuses[user._id] = statusData.status;
      }

      setInviteStatuses(statuses);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (inviteeId: string, currentStatus: string) => {
    try {
      const response = await fetch(
        `/api/playgroups/${playgroupId}/send-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inviterId,
            inviteeId,
            playgroupId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setInviteStatuses((prev) => ({
          ...prev,
          [inviteeId]: currentStatus === "pending" ? "none" : "pending",
        }));
      } else {
        setInviteMessage(data.message || "Failed to send invite");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      setInviteMessage("Failed to send invite");
    }
  };

  const handleRetractInvite = async (inviteeId: string) => {
    try {
      const response = await fetch(
        `/api/playgroups/${playgroupId}/retract-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inviterId,
            inviteeId,
            playgroupId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setInviteMessage("Invite retracted successfully!");
      } else {
        setInviteMessage(data.message || "Failed to retract invite");
      }
    } catch (error) {
      console.error("Error retracting invite:", error);
      setInviteMessage("Failed to retract invite");
    }
  };

  return (
    <div className="p-2 h-screen bottom-16 pt-20">
      <div className="w-full flex items-center justify-center">
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
      {loading && (
        <div className="flex justify-center">
          <CustomLoader />
        </div>
      )}
      <div className="mt-4 flex flex-col justify-center items-center">
        {searchResults.map((user) => {
          const currentStatus = inviteStatuses[user._id] || "none";
          const isMember = playgroupMembers.includes(user._id);
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
                <div className="flex flex-row items-center col-start-7 row-start-2 row-span-2 sm:row-start-1 sm:row-span-1 sm:col-start-8">
                  <Image
                    src={addFriend}
                    alt="User Avatar"
                    width={25}
                    height={25}
                    className="w-6 h-6 object-cover"
                  />
                </div>
                <div className="flex flex-row justify-center items-center col-start-8 col-span-2 row-start-1 row-span-2 sm:row-start-1 sm:row-span-1 sm:col-start-9 sm:col-span-1">
                  {isMember ? (
                    <div className="rounded-lg shadow-lg h-10 w-10 flex justify-center items-center">
                        <Image
                          src={member}
                          alt="Member"
                          width={40}
                          height={40}
                          className="h-full w-full"
                        />
                    </div>
                  ) : currentStatus === "pending" ? (
                    <button
                      onClick={() => handleRetractInvite(user._id)}
                      className="bg-btn rounded-lg shadow-lg h-10 w-10 flex flex-row justify-center items-center"
                    >
                      <Image
                        src={retractInviteIcon}
                        alt="Retract Invite"
                        width={14}
                        height={14}
                        className="w-6 h-6"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleInvite(user._id, inviteStatuses[user._id])
                      }
                      className="bg-btn text-nav rounded-lg shadow-lg h-10 w-10 flex flex-row justify-center items-center"
                    >
                      <Image
                        src={playgroupInvite}
                        alt="Invite User"
                        width={14}
                        height={14}
                        className="w-6 h-6"
                      />
                    </button>
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