"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import addMember from "../../../../../public/assets/Icons/NavColor/user-add4.png";
import leaveGroup from "../../../../../public/assets/Icons/NavColor/portal-exit4.png";
import members from "../../../../../public/assets/Icons/IconColor/users-alt_1.png";
import CustomLoader from "@/app/components/CustomLoading";
import AdminPlaygroupMembersList from "@/app/components/AdminPlaygroupMembers";
import PlaygroupMembersList from "@/app/components/PlaygroupMembers";
import ModeratorPlaygroupMembersList from "@/app/components/ModeratorPlaygroupMembers";
import { fetchPlaygroupData } from "@/lib/fetchPlaygroupData";
import PlaygroupAdminSettings from "@/app/components/PlaygroupAdminSett";
import PlaygroupModeratorSettings from "@/app/components/PlaygroupModeratorSett";
import LeaveGroupPopup from "@/app/components/LeaveGroupPopup";

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

const PlaygroupMembers = () => {
  const pathname = usePathname();
  const router = useRouter();
  const playgroupId = pathname.split("/")[2];
  const [membersList, setMembersList] = useState<PlaygroupMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [showLeaveGroupPopup, setShowLeaveGroupPopup] = useState(false);
  const [playgroupName, setPlaygroupName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchUserAndPlaygroupData = async () => {
      try {
        const tokenResponse = await fetch("/api/get-cookie");
        const tokenData = await tokenResponse.json();

        if (!tokenData.token) {
          router.push("/login");
          return;
        }

        setToken(tokenData.token);

        const userResponse = await fetch("/api/user-profile");
        const userData = await userResponse.json();
        setCurrentUserId(userData.user._id);

        const playgroupData = await fetchPlaygroupData(
          tokenData.token,
          playgroupId
        );
        setMembersList(playgroupData.playgroup.members);
        setPlaygroupName(playgroupData.playgroup.name);

        if (userData.user._id === playgroupData.playgroup.admin) {
          setIsAdmin(true);
        } else if (
          playgroupData.playgroup.moderators.includes(userData.user._id)
        ) {
          setIsModerator(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchUserAndPlaygroupData();
  }, [playgroupId, router]);

  useEffect(() => {
    if (token) {
      const fetchPlaygroup = async () => {
        try {
          const response = await fetchPlaygroupData(token, playgroupId);
          const data = await response;
          const currentUser = await fetch("/api/user-profile");
          const currentUserData = await currentUser.json();
          setCurrentUserId(currentUserData.user._id);
          setMembersList(data.playgroup.members);
          setPlaygroupName(data.playgroup.name);
          if (currentUserId === data.playgroup.admin) {
            setIsAdmin(true);
          } else if (data.playgroup.moderators.includes(currentUserId)) {
            setIsModerator(true);
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching playgroup data:", error);
          setLoading(false);
        }
      };
      fetchPlaygroup();
    }
  }, [token, playgroupId]);

  const handleAddUser = () => {
    router.push(`/search-user?playgroupId=${playgroupId}`);
  };

  const handleLeaveGroup = async () => {
    try {
      await fetch(`/api/playgroups/${playgroupId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      router.push("/messages");
    } catch (error) {
      console.error("Error leaving playgroup:", error);
    }
  };

  const handleLeaveGroupClick = () => {
    setShowLeaveGroupPopup(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="fixed top-20 left-0 right-0 bottom-20 pt-4 flex flex-col items-center mx-2 overflow-auto flex-grow">
      {isAdmin ? (
        <AdminPlaygroupMembersList playgroupId={playgroupId} />
      ) : isModerator ? (
        <ModeratorPlaygroupMembersList playgroupId={playgroupId} />
      ) : (
        <PlaygroupMembersList playgroupId={playgroupId} />
      )}
      {isAdmin && (
        <div className="col-start-2 col-span-2">
          <PlaygroupAdminSettings playgroupId={playgroupId} />
        </div>
      )}
      {isModerator && (
        <div className="col-start-2 col-span-2">
          <PlaygroupModeratorSettings playgroupId={playgroupId} />
        </div>
      )}
      {!isAdmin && !isModerator && (
        <div className="fixed bottom-36 left-0 right-0 h-14 bg-background z-10 flex justify-evenly items-center border-t-2 border-bg3">
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
              alt="Leave Group Icon"
              width={25}
              height={25}
              className="w-6 h-6"
            />
            <p className="text-textcolor font-bold text-xl ml-2">
              {membersList.length}
            </p>
          </div>
          {showLeaveGroupPopup && (
            <LeaveGroupPopup
              playgroup={playgroupName}
              onConfirm={handleLeaveGroup}
              onCancel={() => setShowLeaveGroupPopup(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PlaygroupMembers;