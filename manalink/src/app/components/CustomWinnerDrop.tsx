import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import winnerIcon from "../../../public/assets/Icons/IconColor/medal.png";
import arrowDownIcon from "../../../public/assets/Icons/IconColor/angle-small-down.png";
import arrowUpIcon from "../../../public/assets/Icons/IconColor/angle-small-up (1).png";

interface PlaygroupMember {
  _id: string;
  username: string;
  userCode: string;
  level: number;
  profilePicture: string;
  friends: string[];
  isAdmin?: boolean;
  isModerator?: boolean;
  playgroups: string[];
}

const CustomWinnerDropdown = ({
  participants,
  winningParticipant,
  setWinningParticipant,
}: {
  participants: PlaygroupMember[];
  winningParticipant: PlaygroupMember | null;
  setWinningParticipant: (member: PlaygroupMember | null) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (member: PlaygroupMember) => {
    setWinningParticipant(member);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <div
        className="w-full bg-input bg-opacity-20 rounded-md p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Image src={winnerIcon} alt="Winner Icon" width={24} height={24} className="mr-2" />
          <span className="text-textcolor ml-2">
            {winningParticipant ? winningParticipant.username : "Select Winner"}
          </span>
        </div>
        {!isOpen ? (
          <Image src={arrowDownIcon} alt="Arrow Down Icon" width={24} height={24} className="mr-2" />
        ) : (
          <Image src={arrowUpIcon} alt="Arrow Up Icon" width={24} height={24} className="mr-2" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-bg3 border border-logo rounded-md shadow-lg">
          {participants.map((member) => (
            <div
              key={member._id}
              className="p-2 hover:bg-background text-textcolor cursor-pointer rounded-lg"
              onClick={() => handleSelect(member)}
            >
              {member.username} #{member.userCode}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomWinnerDropdown;