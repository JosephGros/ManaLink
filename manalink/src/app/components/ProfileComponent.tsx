"use client";
import { calculateRequiredXP } from "@/lib/xpConstants";
import { useEffect, useState } from "react";
import Image from "next/image";
import BackButton from "../components/BackBtn";
import CustomLoader from "../components/CustomLoading";
import { useRouter } from "next/navigation";
import addFriendsIcon from "../../../public/assets/Icons/NavColor/user-add4.png";
import leaderBoard from "../../../public/assets/Icons/NavColor/leaderboard.png";

const ProfileComponent = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setUser(data.user);
        console.log(data.user);
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const addXP = async (xpAmount: number) => {
    if (user) {
      const response = await fetch("/api/add-xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, xpToAdd: xpAmount }),
      });
      const data = await response.json();
      const updatedUserResponse = await fetch("/api/user-profile");
      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData.user);
    }
  };

  const getXPImage = (progressPercentage: number) => {
    if (progressPercentage >= 100) return "/assets/Icons/lvl/XP100.png";
    if (progressPercentage >= 75) return "/assets/Icons/lvl/XP75.png";
    if (progressPercentage >= 50) return "/assets/Icons/lvl/XP50.png";
    if (progressPercentage >= 25) return "/assets/Icons/lvl/XP25.png";
    return "/assets/Icons/lvl/XP00.png";
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  const currentXP = user.xp;
  const nextLevelXP = calculateRequiredXP(user.level + 1);
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  const xpImage = getXPImage(progressPercentage);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center rounded-md bg-bg2 w-4/5 max-w-96 p-4">
        <div>
          <div className="flex flex-row justify-between items-center">
            <BackButton
              label="Back"
              className="text-textcolor rounded-md w-12"
            />
            <a href="/user-settings">
              <Image
                src="/assets/Icons/IconColor/user-gear_2.png"
                alt="Settings Icon"
                width={20}
                height={20}
              />
            </a>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div>
              <Image
                src={user.profilePicture || "/assets/profile-pics/mtg.webp"}
                alt="Profile picture"
                width={160}
                height={160}
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
            </div>
            <h1 className="font-bold text-textcolor text-2xl truncate max-w-72">
              {user.username}
            </h1>
            <p className="text-textcolor text-md pb-4">#{user.userCode}</p>
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
                      Lvl {user.level} - {currentXP}/{nextLevelXP} XP
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
                  <a href="/friend/friendList" className="text-base font-bold">
                    {user.friends.length} - Friends
                  </a>
                </div>
                <div className="flex items-center mb-5 ml-2">
                  <Image
                    src="/assets/Icons/IconColor/subscription-user (1).png"
                    alt="Friend Requests Icon"
                    width={28}
                    height={28}
                    className="mr-4"
                  />
                  <a href="/friend/requests" className="text-base font-bold">
                    {user.friendRequestsReceived.length} - Friend Requests
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
                    {user.decks.length || 0} - Decks
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
                    {user.playgroups.length} - Playgroups
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
                    {user.gamesWon} - Wins
                  </a>
                </div>
                {/* <div className="flex items-center mb-5 ml-2">
                  <Image
                    src="/assets/Icons/IconColor/book-dead12.png"
                    alt="Games Played Icon"
                    width={28}
                    height={28}
                    className="mr-4"
                  />
                  <a href="" className="text-base font-bold">
                    {user.gamesPlayed} - Games Played
                  </a>
                </div> */}
              </div>
              <div className="flex flex-row justify-evenly">
                <button className="bg-btn text-nav px-4 py-1 rounded-lg font-bold w-28 flex justify-center">
                    <a href="/friend/user-search">
                    <Image
                        src={leaderBoard}
                        alt="Pending"
                        width={25}
                        height={25}
                    />
                    </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;