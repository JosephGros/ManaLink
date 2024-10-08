'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PlaygroupLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
        <div className="fixed top-14 left-0 right-0 bottom-32">
            <div className="w-full h-full flex flex-col overflow-auto">
                {children}
            </div>
        </div>

      <nav className="p-4 flex items-center border-t-2 border-bg3 fixed bottom-16 left-0 right-0 h-16 bg-background z-10">
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
          <button className="p-2">Games Playedz</button>
        </Link>
      </nav>
    </div>
  );
};

export default PlaygroupLayout;