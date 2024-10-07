import UserSearch from "../components/SearchUser";
import CustomLoader from "../components/CustomLoading";
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

  const userResponse = await fetch(`${process.env.BASE_URL}/api/user-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const userData = await userResponse.json();

  if (!userData?.userId) {
    return <div>Error: Failed to retrieve user data</div>;
  }

  const user = userData.userId;

  return (
    <div>
      <UserSearch inviterId={userData.userId} playgroupId={playgroupId} />
    </div>
  );
}