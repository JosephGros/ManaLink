'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PlaygroupLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
        <div className="flex-1 p-4 bg-gray-900 text-white">{children}</div>

      <nav className="flex justify-around bg-gray-800 p-2 text-white">
        <Link href={`${pathname}/chat`} passHref>
          <button className="p-2">Chat</button>
        </Link>
        <Link href={`${pathname}/members`} passHref>
          <button className="p-2">Members</button>
        </Link>
        <Link href={`${pathname}/calendar`} passHref>
          <button className="p-2">Calendar</button>
        </Link>
        <Link href={`${pathname}/games`} passHref>
          <button className="p-2">Games Played</button>
        </Link>
      </nav>
    </div>
  );
};

export default PlaygroupLayout;