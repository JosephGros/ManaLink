import { fetchPlaygroupData } from "@/lib/fetchPlaygroupData";
import { cookies } from "next/headers";
import PlaygroupLayout from "./layout";
import { fetchAnyUser } from "@/lib/fetchAnyUser";
import Image from "next/image";
import playgroupIcon from "../../../../public/assets/Icons/IconColor/dice-d20_1.png";
import friendsIcon from "../../../../public/assets/Icons/IconColor/users.png";
import addFriend from "../../../../public/assets/Icons/IconColor/shield-plus.png";
import removeFriend from "../../../../public/assets/Icons/IconColor/shield-check_1.png";
import admin from "../../../../public/assets/Icons/IconColor/crown2.png";
import PlaygroupAdminCard from "@/app/components/PlaygroupAdminCard";

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
  try {
    playgroup = await fetchPlaygroupData(token, playgroupId);
    user = await fetchAnyUser(playgroup.playgroup.admin);
    console.log('KCMNSDLCNDOCVMDOCKLC : ', user);
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
        <PlaygroupAdminCard user={user.user} />
        <p>Members: {playgroup.playgroup.members.length}</p>
      </div>
    </PlaygroupLayout>
  );
}