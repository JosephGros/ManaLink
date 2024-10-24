"use client";

import GameForm from "@/app/components/GameForm";
import { usePathname } from "next/navigation";

const RegisterGamePage = async () => {
    const pathname = usePathname();
    const playgroupId = pathname.split("/")[2];

  return (
    <div className="flex flex-col justify-center items center">
        <GameForm playgroupId={playgroupId}/>
    </div>
  );
};

export default RegisterGamePage;
