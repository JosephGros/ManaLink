import { useRouter } from 'next/navigation';
import React from 'react';

interface BackButtonProps {
  label?: string;
  customPath?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label = 'Go Back', customPath, className }) => {
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
      {label}
    </button>
  );
};

export default BackButton;
