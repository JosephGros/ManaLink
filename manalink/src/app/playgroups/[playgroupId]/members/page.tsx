"use client";

import { usePathname, useRouter } from "next/navigation";

const PlaygroupMembers = () => {
  const pathname = usePathname();
  const router = useRouter();

  const playgroupId = pathname.split("/")[2];

  const handleAddUser = () => {
    router.push(`/search-user?playgroupId=${playgroupId}`);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Members</h2>
      <button
        onClick={handleAddUser}
        className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg"
      >
        Add user
      </button>
    </div>
  );
};

export default PlaygroupMembers;