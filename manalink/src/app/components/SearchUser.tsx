"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomLoader from "./CustomLoading";
import searchIcon from "../../../public/assets/Icons/NavColor/search3.png";
import playgroupIcon from "../../../public/assets/Icons/IconColor/dice-d20_1.png";
import playgroupInvite from "../../../public/assets/Icons/NavColor/comment-alt-medical.png";
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

const UserSearch = ({ inviterId, playgroupId }: { inviterId: string, playgroupId: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

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
      const query = new URLSearchParams({
        ...(username && { username }),
        ...(userCode && { userCode }),
        currentUserId: inviterId,
      }).toString();

      const response = await fetch(`/api/search-users?${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (inviteeId: string) => {
    try {
      const response = await fetch(`/api/playgroups/${playgroupId}/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviterId,
          inviteeId,
          playgroupId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setInviteMessage("Invitation sent successfully!");
      } else {
        setInviteMessage(data.message || 'Failed to send invite');
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      setInviteMessage("Failed to send invite");
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
            className="w-72 h-10 bg-input bg-opacity-20 rounded-l-md placeholder:text-textcolor placeholder:opacity-50 text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
          />
          <button
            onClick={handleSearch}
            className="bg-btn p-2 rounded-r-md shadow-lg h-10 w-10"
          >
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </button>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center"><CustomLoader /></div>
      )}
      <div className="mt-4 flex flex-col justify-center items-center">
        {searchResults.map((user) => (
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
                    <p className="text-xs text-textcolor text-center mt-1">lvl {user.level}</p>
                </div>
              <div className="col-start-3 col-end-8 row-start-1 row-span-1 sm:row-start-1 sm:row-span-1 sm:col-start-2 sm:col-end-5">
                <div className="flex flex-row sm:flex-col items-center sm:items-start">
                    <p className="font-bold text-xl text-textcolor truncate max-w-44">
                    {user.username}
                    </p>
                    {/* <p className="text-xs text-textcolor ml-1 sm:ml-0">lvl {user.level}</p> */}
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
                <p className="text-textcolor text-start pl-2 sm:text-center sm:pl-0 text-xs w-full">{user.friends.length}</p>
              </div>
              <div className="flex flex-row sm:justify-center items-center col-start-5 col-span-2 row-start-2 row-span-2 sm:row-start-1 sm:row-span-1 sm:col-start-7 sm:col-span-1">
                <Image
                  src={playgroupIcon}
                  alt="User Avatar"
                  width={25}
                  height={25}
                  className="w-6 h-6 object-cover"
                />
                <p className="text-textcolor text-start pl-2 sm:text-center sm:pl-0 text-xs w-full">{user.playgroups.length}</p>
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
                <button 
                onClick={() => handleInvite(user._id)}
                className="bg-btn text-nav rounded-lg shadow-lg h-10 w-10 sm:h-10 sm:w-10 flex flex-row justify-center items-center">
                    <Image
                    src={playgroupInvite}
                    alt="User Avatar"
                    width={14}
                    height={14}
                    className="w-6 h-6"
                    />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
