"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import addMember from "../../../public/assets/Icons/NavColor/user-add4.png";
import memberSettings from "../../../public/assets/Icons/NavColor/user-gear (1).png";
import members from "../../../public/assets/Icons/IconColor/users-alt_1.png";
import leaveGroup from "../../../public/assets/Icons/NavColor/portal-exit4.png";
import { useRouter } from "next/navigation";
import CustomMemberDropdown from "./CustomMemberDrop";
import CustomRoleDropdown from "./CustomRoleDrop";
import RemoveMemberPopup from "./RemoveMemberPopup";
import LeaveGroupPopup from "./LeaveGroupPopup";

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

const PlaygroupModeratorSettings = ({
  playgroupId,
}: {
  playgroupId: string;
}) => {
  const [userId, setUserId] = useState("");
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [membersList, setMembersList] = useState<PlaygroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<PlaygroupMember | null>(
    null
  );
  const [role, setRole] = useState<string>("Member");
  const [showMemberSettings, setShowMemberSettings] = useState(false);
  const router = useRouter();
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [playgroupName, setPlaygroupName] = useState("");
  const [showLeaveGroupPopup, setShowLeaveGroupPopup] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/playgroups/${playgroupId}/members`);
        const data = await response.json();
        setMembersList(data.members);
        setPlaygroupName(data.name);
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

  const handleAddUser = () => {
    router.push(`/search-user?playgroupId=${playgroupId}`);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await fetch(`/api/playgroups/${playgroupId}/remove-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      setMembersList((prev) =>
        prev.filter((member) => member._id !== memberId)
      );
      setShowRemovePopup(false);
      setShowMemberSettings(false);
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleRemoveClick = () => {
    if (selectedMember) {
      setShowRemovePopup(true);
    }
  };

  const openMemberSettings = () => {
    setShowMemberSettings(true);
  };

  const handleSaveSettings = async () => {
    if (selectedMember) {
      try {
        await fetch(`/api/playgroups/${playgroupId}/promote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: selectedMember._id,
            role,
          }),
        });

        setShowMemberSettings(false);
      } catch (error) {
        console.error("Error updating member role:", error);
      }
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await fetch(`/api/playgroups/${playgroupId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });
      router.push("/messages");
    } catch (error) {
      console.error("Error leaving playgroup:", error);
    }
  };

  const handleLeaveGroupClick = () => {
    setShowLeaveGroupPopup(true);
  };

  return (
    <div className="text-textcolor">
      <div className="fixed bottom-36 left-0 right-0 h-14 bg-background z-10 flex justify-evenly items-center border-t-2 border-bg3 px-2">
        <button
          onClick={handleAddUser}
          className="col-start-1 bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center"
        >
          <Image
            src={addMember}
            alt="Add Member Icon"
            width={25}
            height={25}
            className="w-6 h-6"
          />
        </button>
        <button
          onClick={openMemberSettings}
          className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center"
        >
          <Image
            src={memberSettings}
            alt="Member setting Icon"
            width={25}
            height={25}
            className="w-6 h-6"
          />
        </button>
        <button
          onClick={handleLeaveGroupClick}
          className="col-start-2 bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center"
        >
          <Image
            src={leaveGroup}
            alt="Leave Group Icon"
            width={25}
            height={25}
            className="w-6 h-6"
          />
        </button>
        <div className="col-start-4 flex flex-row h-10 w-24 justify-center items-center">
          <Image
            src={members}
            alt="Member Ammount"
            width={25}
            height={25}
            className="w-6 h-6"
          />
          <p className="text-textcolor font-bold text-xl ml-2">
            {membersList.length}
          </p>
        </div>
      </div>
      {showMemberSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-textcolor">
          <div className="bg-bg2 p-6 rounded-lg w-11/12 sm:w-96">
            <h2 className="text-2xl text-center text-white mb-4">
              Edit group members
            </h2>
            <div className="flex flex-col items-center justify-center mb-4">
              <CustomMemberDropdown
                membersList={membersList}
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
              />
              <div className="relative flex items-center w-64 mb-4 mt-2">
                <CustomRoleDropdown role={role} setRole={setRole} />
              </div>
            </div>
            <div className="flex justify-between mt-4 w-full">
              <button
                onClick={() => setShowMemberSettings(false)}
                className="w-24 h-9 bg-btn rounded-md text-nav font-bold shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveClick}
                className="w-24 h-9 bg-btn rounded-md text-danger2 font-bold shadow-lg"
              >
                Remove
              </button>
              <button
                onClick={handleSaveSettings}
                className="w-24 h-9 bg-btn rounded-md text-nav font-bold shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showRemovePopup && selectedMember && (
        <RemoveMemberPopup
          member={selectedMember.username}
          onConfirm={() => handleRemoveMember(selectedMember._id!)}
          onCancel={() => setShowRemovePopup(false)}
        />
      )}
      {showLeaveGroupPopup && (
        <LeaveGroupPopup
          playgroup={playgroupName}
          onConfirm={handleLeaveGroup}
          onCancel={() => setShowLeaveGroupPopup(false)}
        />
      )}
    </div>
  );
};

export default PlaygroupModeratorSettings;