import { useState, useRef } from "react";
import Image from "next/image";
import userIcon from "../../../public/assets/Icons/IconColor/circle-user (1).png";
import arrowDownIcon from "../../../public/assets/Icons/IconColor/angle-small-down.png";
import arrowUpIcon from "../../../public/assets/Icons/IconColor/angle-small-up (1).png";
import roleIcon from "../../../public/assets/Icons/IconColor/dice-d20_1.png";

interface CustomRoleDropdownProps {
  role: string;
  setRole: (role: string) => void;
}

const CustomRoleDropdown = ({ role, setRole }: CustomRoleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (role: string) => {
    setRole(role);
    setIsOpen(false);
  };

  const roleOptions = ["Member", "Moderator"];

  return (
    <div className="relative w-64">
      <div
        className="w-full bg-input bg-opacity-20 rounded-md p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Image
            src={roleIcon}
            alt="Role Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="text-textcolor">{role || "Select Role"}</span>
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
          {roleOptions.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-background text-textcolor cursor-pointer rounded-lg"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRoleDropdown;