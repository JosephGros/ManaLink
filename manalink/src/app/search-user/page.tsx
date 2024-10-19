import { fetchUserData } from "@/lib/fetchUserData";
import UserMemberSearch from "../components/SearchUser";
import { cookies } from "next/headers";
interface SearchUsersProps {
  searchParams: { playgroupId: string };
}

export default async function SearchUsers({ searchParams }: SearchUsersProps) {
  const playgroupId = searchParams?.playgroupId;

  if (!playgroupId) {
    return <div>Error: Playgroup ID is missing</div>;
  }

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Error: User not authenticated</div>;
  }

  try {
    const userData = await fetchUserData(token);

    if (!userData?.user._id) {
      return <div>Error: Failed to retrieve user data</div>;
    }

    const user = userData.user._id;

    return (
      <div>
        <UserMemberSearch inviterId={user} playgroupId={playgroupId} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data", error);
    return <div>Error: Could not fetch user data</div>;
  }
}