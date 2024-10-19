"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import backArrow from "../../../public/assets/Icons/IconColor/arrow-small-left.png";

interface BackButtonProps {
  label?: string;
  customPath?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  label = "Go Back",
  customPath,
  className,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (customPath) {
      router.push(customPath);
    } else {
      router.back();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      <Image
        src={backArrow}
        alt={label}
        width={20}
        height={20}
        className="w-8 h-8 rounded-full object-cover"
      />
    </button>
  );
};

export default BackButton;