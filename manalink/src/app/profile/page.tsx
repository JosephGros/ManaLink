"use client";
import { calculateRequiredXP } from "@/lib/xpConstants";
import { useEffect, useState } from "react";
import { CustomLoader } from "../components/CustomLoading";
import Image from "next/image";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setUser(data.user);
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
      console.log(data);
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

  if (loading)
    return (
      <div>
        <CustomLoader />
      </div>
    );

  if (!user) return <div>No user data available</div>;

  const currentXP = user.xp;
  const nextLevelXP = calculateRequiredXP(user.level + 1);
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  const xpImage = getXPImage(progressPercentage);

  return (
    <div className="flex justify-center">
      <div className="flex items-center flex-col w-96 h-screen p-4 pt-28">
        <div>
          <img
            src={
              user.profilePicture || "/assets/profile-pics/default-avatar.png"
            }
            alt="Profile picture"
            className="w-40 h-40 rounded-full object-cover mb-4"
          />
          <a href="/user-settings">Settings</a>
        </div>
        <h1 className="font-bold italic text-textcolor text-2xl pb-4">
          {user.username}
        </h1>
        <div className="flex flex-row justify-evenly w-96 mb-4">
          <div className="">
            <Image
              src={xpImage}
              alt="XP Level"
              width={23}
              height={23}
              className="absolute"
            />
          </div>
          <div className="w-72 bg-progressbar rounded-md h-6 relative shadow-md">
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
        <div className="flex flex-col w-96 p-2 rounded-md bg-bg2">
          <div className="mt-4 font-bold italic text-textcolor text-lg">
            <div className="flex items-center mb-5 ml-2">
              <img
                src="/assets/Icons/IconColor/users.png"
                alt="Friends Icon"
                className="w-8 h-8 mr-4"
              />
              <a href="">{user.friends.length} - Friends</a>
            </div>
            <a href=""></a>
            <div className="flex items-center mb-5 ml-2">
              <img
                src="/assets/Icons/IconColor/trophy-star.png"
                alt="Achievements Icon"
                className="w-8 h-8 mr-4"
              />
              <a href="">{user.achievements.length} - Achievements</a>
            </div>

            <div className="flex items-center mb-5 ml-2">
              <img
                src="/assets/Icons/IconColor/dice-d20_1.png"
                alt="Playgroups Icon"
                className="w-8 h-8 mr-4"
              />
              <a href="">{user.playgroups.length} - Playgroups</a>
            </div>

            <div className="flex items-center mb-5 ml-2">
              <img
                src="/assets/Icons/IconColor/medal.png"
                alt="Wins Icon"
                className="w-8 h-8 mr-4"
              />
              <a href="">{user.gamesWon} - Wins</a>
            </div>

            <div className="flex items-center mb-5 ml-2">
              <img
                src="/assets/Icons/IconColor/book-dead12.png"
                alt="Games Played Icon"
                className="w-8 h-8 mr-4"
              />
              <a href="">{user.gamesPlayed} - Games Played</a>
            </div>
          </div>
          <button
            onClick={() => addXP(200)}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
          >
            Add 200 XP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
