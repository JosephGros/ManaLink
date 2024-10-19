"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomLoader from "./CustomLoading";
import searchIcon from "../../../public/assets/Icons/NavColor/search3.png";
import friendsIcon from "../../../public/assets/Icons/IconColor/users.png";
import addFriendIcon from "../../../public/assets/Icons/IconColor/shield-plus.png";
import removeFriendIcon from "../../../public/assets/Icons/NavColor/shield-check.png";
import BackButton from "./BackBtn";

interface PlaygroupMember {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
}

const PlaygroupMembersList = ({ playgroupId }: { playgroupId: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const [membersList, setMembersList] = useState<PlaygroupMember[]>([]);
  const [searchResults, setSearchResults] = useState<PlaygroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [manageMessage, setManageMessage] = useState<string | null>(null);

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        username: searchInput,
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

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/playgroups/${playgroupId}/remove-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId }),
      });

      const data = await response.json();
      if (data.success) {
        setManageMessage("Member removed!");
        setMembersList((prev) =>
          prev.filter((member) => member._id !== memberId)
        );
      } else {
        setManageMessage(data.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      setManageMessage("Failed to remove member");
    }
  };

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
          {membersList.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-2 bg-bg2 rounded-lg my-1 shadow-md h-18 w-11/12 sm:w-3/4"
            >
              <div className="grid grid-cols-9 gap-x-1 flex items-center w-full">
                <div className="flex flex-col justify-center items-center col-span-2 w-18">
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
                <div className="col-span-5">
                  <p className="font-bold text-xl text-textcolor truncate">
                    <a
                      href={`/otherUserProfile/${member._id}?userId=${member._id}`}
                    >
                      {member.username}
                    </a>
                  </p>
                  <p className="text-xs text-start text-textcolor text-center mt-1">
                    lvl {member.level}
                  </p>
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="bg-btn text-danger px-4 py-1 rounded-lg"
                  >
                    <Image
                      src={removeFriendIcon}
                      alt="Remove Member"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaygroupMembersList;