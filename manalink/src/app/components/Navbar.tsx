import Image from 'next/image';
import Link from 'next/link';
import UsersIcon from '../../../public/assets/Icons/NavIcons/network-user_1.png';
import CalendarIcon from '../../../public/assets/Icons/NavIcons/calendar-days_1.png';
import FortIcon from '../../../public/assets/Icons/NavIcons/castle_1.png';
import CommentsIcon from '../../../public/assets/Icons/NavIcons/messages_1.png';
import ProfileIcon from '../../../public/assets/Icons/NavIcons/circle-user.png';

const Navbar = () => {
  return (
    <nav className="bg-nav fixed bottom-0 w-full pb-4 h-20 flex justify-around items-center shadow-lg z-20">
      <Link href="/users" passHref>
        <button className="flex flex-col items-center justify-center">
          <Image src={UsersIcon} alt="Users" width={24} height={24} />
        </button>
      </Link>
      <Link href="/calendar" passHref>
        <button className="flex flex-col items-center justify-center">
          <Image src={CalendarIcon} alt="Calendar" width={24} height={24} />
        </button>
      </Link>
      <Link href="/" passHref>
        <button className="flex flex-col items-center justify-center">
          <Image src={FortIcon} alt="Fort" width={24} height={24} />
        </button>
      </Link>
      <Link href="/messages" passHref>
        <button className="flex flex-col items-center justify-center">
          <Image src={CommentsIcon} alt="Comments" width={24} height={24} />
        </button>
      </Link>
      <Link href="/profile" passHref>
        <button className="flex flex-col items-center justify-center relative">
          <Image src={ProfileIcon} alt="Profile" width={24} height={24} />
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;