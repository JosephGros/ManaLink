"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import newPlaygroup from "../../../../public/assets/Icons/NavColor/messages_4.png";

const PlaygroupLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <div className="fixed top-14 left-0 right-0 bottom-32">
        <div className="w-full h-full flex flex-col overflow-auto">
          {children}
        </div>
      </div>

      <nav className="p-2 flex justify-evenly items-center border-t-2 border-bg3 fixed bottom-16 left-0 right-0 h-16 bg-background z-10">
        <Link href={`${pathname}/chat`} passHref>
          <button className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center">
            <Image src={newPlaygroup} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
        <Link href={`${pathname}/members`} passHref>
          <button className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center">
            <Image src={newPlaygroup} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
        <Link href={`${pathname}/calendar`} passHref>
          <button className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center">
            <Image src={newPlaygroup} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
        <Link href={`${pathname}/games`} passHref>
          <button className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center">
            <Image src={newPlaygroup} alt="Playgroup" width={33} height={33} />
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default PlaygroupLayout;