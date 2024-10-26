import { fetchPlaygroupData } from "@/lib/fetchPlaygroupData";
import { cookies } from "next/headers";
import PlaygroupLayout from "./layout";
import { fetchAnyUser } from "@/lib/fetchAnyUser";
import Image from "next/image";
import PlaygroupAdminCard from "@/app/components/PlaygroupAdminCard";
import { fetchUserData } from "@/lib/fetchUserData";

interface PlaygroupPageProps {
  searchParams: { playgroupId?: string };
}

export default async function PlaygroupPage({
  searchParams,
}: PlaygroupPageProps) {
  const playgroupId = searchParams.playgroupId;

  if (!playgroupId) {
    return <div>Error: Playgroup ID is missing</div>;
  }

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Error: User not authenticated</div>;
  }

  let playgroup;
  let user;
  let currentUser;
  try {
    playgroup = await fetchPlaygroupData(token, playgroupId);
    user = await fetchAnyUser(playgroup.playgroup.admin);
    currentUser = await fetchUserData(token);
  } catch (error) {
    console.error("Error fetching playgroup data:", error);
    return <div>Error loading playgroup</div>;
  }

  if (!playgroup) {
    return <div>Error: Playgroup not found</div>;
  }

  return (
    <PlaygroupLayout>
      <div className="flex flex-col justify-center items-center">
        <div>
          <Image
            src={
              playgroup.playgroup.profilePicture ||
              "/assets/profile-pics/mtg.webp"
            }
            alt="Profile picture"
            width={160}
            height={160}
            className="w-40 h-40 rounded-full object-cover mb-4"
          />
        </div>
        <h1 className="font-bold text-textcolor text-4xl mb-4 truncate max-w-72">
          {playgroup.playgroup.playgroupname}
        </h1>
        <PlaygroupAdminCard
          user={user.user}
          currentUserId={currentUser.user._id}
        />
        <div className="flex flex-col justify-center items-center w-full">
          <div className="mt-4 font-bold text-textcolor text-lg">
            <div className="flex items-center mb-5 ml-2">
              <Image
                src="/assets/Icons/IconColor/users.png"
                alt="Friends Icon"
                width={38}
                height={38}
                className="mr-4"
              />
              <p>
                {playgroup.playgroup.members.length} - Members
              </p>
            </div>
            <div className="flex items-center mb-5 ml-2">
              <Image
                src="/assets/Icons/IconColor/subscription-user (1).png"
                alt="Friend Requests Icon"
                width={38}
                height={38}
                className="mr-4"
              />
              <p>
                {playgroup.playgroup.games.length} - Games Played
              </p>
            </div>
          </div>
        </div>
      </div>
    </PlaygroupLayout>
  );
}