"use client";

import Image from 'next/image';
import Link from 'next/link';
import UsersIcon from '../../../public/assets/Icons/NavIcons/network-user_1.png';
import CalendarIcon from '../../../public/assets/Icons/NavIcons/calendar-days_1.png';
import FortIcon from '../../../public/assets/Icons/NavIcons/castle_1.png';
import CommentsIcon from '../../../public/assets/Icons/NavIcons/messages_1.png';
import ProfileIcon from '../../../public/assets/Icons/NavIcons/circle-user.png';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    const getActiveClass = (path: string) => {
        return pathname === path  ? 'border-2 border-icon w-14 h-14 bg-activeNav rounded-full shadow-lg' : '';
      };

  return (
    <nav className="bg-nav fixed bottom-0 w-full pb-4 h-20 flex justify-around items-center shadow-lg z-20">
      <Link href="/users" passHref>
        <button className={`flex flex-col items-center justify-center ${getActiveClass('/users')} w-14 h-14`}>
          <Image src={UsersIcon} alt="Users" width={35} height={35} />
        </button>
      </Link>
      <Link href="/calendar" passHref>
        <button className={`flex flex-col items-center justify-center ${getActiveClass('/calendar')} w-14 h-14`}>
          <Image src={CalendarIcon} alt="Calendar" width={35} height={35} />
        </button>
      </Link>
      <Link href="/" passHref>
        <button className={`flex flex-col items-center justify-center ${getActiveClass('/')} w-14 h-14`}>
          <Image src={FortIcon} alt="Fort" width={35} height={35} />
        </button>
      </Link>
      <Link href="/messages" passHref>
        <button className={`flex flex-col items-center justify-center ${getActiveClass('/messages')} w-14 h-14`}>
          <Image src={CommentsIcon} alt="Comments" width={35} height={35} />
        </button>
      </Link>
      <Link href="/profile" passHref>
        <button className={`flex flex-col items-center justify-center relative ${getActiveClass('/profile')} w-14 h-14`}>
          <Image src={ProfileIcon} alt="Profile" width={35} height={35} />
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;