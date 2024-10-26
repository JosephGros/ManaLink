import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import userIcon from "../../../public/assets/Icons/IconColor/circle-user (1).png";
import arrowDownIcon from "../../../public/assets/Icons/IconColor/angle-small-down.png";
import arrowUpIcon from "../../../public/assets/Icons/IconColor/angle-small-up (1).png";
import roleIcon from "../../../public/assets/Icons/IconColor/dice-d20_1.png";

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

const CustomMemberDropdown = ({
  membersList,
  selectedMember,
  setSelectedMember,
}: {
  membersList: PlaygroupMember[];
  selectedMember: PlaygroupMember | null;
  setSelectedMember: (member: PlaygroupMember | null) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sortedMembers, setSortedMembers] = useState<PlaygroupMember[]>([]);

  useEffect(() => {
    const sorted = [...membersList].sort((a, b) =>
      a.username.localeCompare(b.username)
    );
    setSortedMembers(sorted);
  }, [membersList]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (member: PlaygroupMember) => {
    setSelectedMember(member);
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

  const groupedMembers = sortedMembers.reduce((acc, member) => {
    const firstLetter = member.username[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(member);
    return acc;
  }, {} as Record<string, PlaygroupMember[]>);

  return (
    <div className="relative w-64">
      <div
        className="w-full bg-input bg-opacity-20 rounded-md p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Image
            src={userIcon}
            alt="User Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="text-textcolor ml-2">
            {selectedMember ? selectedMember.username : "Select Member"}{" "}
          </span>
        </div>
        {!isOpen ? (
          <Image
            src={arrowDownIcon}
            alt="Arrow Down Icon"
            width={24}
            height={24}
            className="mr-2"
          />
        ) : (
          isOpen && (
            <Image
              src={arrowUpIcon}
              alt="Arrow Up Icon"
              width={24}
              height={24}
              className="mr-2"
            />
          )
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-bg3 border border-logo rounded-md shadow-lg"
        >
          {Object.entries(groupedMembers).map(([letter, members]) => (
            <div key={letter}>
              <div className="p-2 text-lighttext text-sm font-bold border-b border-opacity-50 border-bg3">
                {letter}
              </div>
              {members.map((member) => (
                <div
                  key={member._id}
                  className="p-2 hover:bg-background text-textcolor cursor-pointer rounded-lg"
                  onClick={() => handleSelect(member)}
                >
                  {member.username} #{member.userCode}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMemberDropdown;