"use client";

import { useSearchParams } from "next/navigation";
import UserSearch from "../components/SearchUser";
import { useEffect, useState } from "react";
import CustomLoader from "../components/CustomLoading";

const SearchUsers = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const playgroupId = searchParams.get("playgroupId");

  if (!playgroupId) {
    return <div>Error: Playgroup ID is missing</div>;
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex justify-center"><CustomLoader /></div>;
  }

  return (
    <div>
      <UserSearch inviterId={user._id} playgroupId={playgroupId} />
    </div>
  );
};

export default SearchUsers;