"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import chat from "../../../../public/assets/Icons/NavColor/messages_4.png";
import calendar from "../../../../public/assets/Icons/NavColor/calendar-days_3.png";
import games from "../../../../public/assets/Icons/NavColor/book-dead4.png";
import members from "../../../../public/assets/Icons/NavColor/users-alt_4.png";

const PlaygroupLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const search = useSearchParams();

  const playgroupId = pathname.split("/")[2];

  const isActive = (route: string) => pathname.includes(route);

  return (
    <div className="h-full flex flex-col">
      <div className="fixed top-14 left-0 right-0 bottom-32">
        <div className="w-full h-full flex flex-col overflow-auto">
          {children}
        </div>
      </div>

      <nav className="p-2 flex justify-evenly items-center border-t-2 border-bg3 fixed bottom-20 left-0 right-0 h-16 bg-background z-10">
        <Link href={`/playgroups/${playgroupId}/chat`} passHref>
          <button className={`${
              isActive("chat") ? "ring-4 ring-icon" : ""
            } bg-btn text-nav p-3 rounded-lg shadow-lg h-10 sm:w-24 w-20 flex justify-center items-center`}>
            <Image src={chat} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
        <Link href={`/playgroups/${playgroupId}/calendar`} passHref>
          <button className={`${
              isActive("calendar") ? "ring-4 ring-icon" : ""
            } bg-btn text-nav p-3 rounded-lg shadow-lg h-10 sm:w-24 w-20 flex justify-center items-center`}>
            <Image src={calendar} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
        <Link href={`/playgroups/${playgroupId}/games`} passHref>
          <button className={`${
              isActive("games") ? "ring-4 ring-icon" : ""
            } bg-btn text-nav p-3 rounded-lg shadow-lg h-10 sm:w-24 w-20 flex justify-center items-center`}>
            <Image src={games} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
        <Link href={`/playgroups/${playgroupId}/members`} passHref>
          <button className={`${
              isActive("members") ? "ring-4 ring-icon" : ""
            } bg-btn text-nav p-3 rounded-lg shadow-lg h-10 sm:w-24 w-20 flex justify-center items-center`}>
            <Image src={members} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default PlaygroupLayout;