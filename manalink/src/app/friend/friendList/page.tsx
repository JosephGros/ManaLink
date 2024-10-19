import FriendsList from "@/app/components/FriendsList";
import { cookies } from "next/headers";
import { fetchUserData } from "@/lib/fetchUserData";

interface FriendsListProps {
  searchParams: { userId?: string };
}

const FriendsListPage = async ({ searchParams }: FriendsListProps) => {
  const profileUserId = searchParams?.userId;

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let currentUserId;

  if (token) {
    try {
      const userData = await fetchUserData(token);
      currentUserId = userData.user._id;
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  }

  const userIdToUse = profileUserId || currentUserId;

  if (!userIdToUse) {
    return <div>Error: User not found or not authenticated</div>;
  }

  return (
    <FriendsList userId={userIdToUse} />
  );
};

export default FriendsListPage;
