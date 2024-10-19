import { cookies } from "next/headers";
import { fetchAnyUser } from "@/lib/fetchAnyUser";
import { fetchUserData } from "@/lib/fetchUserData";
import OtherUserProfileComponent from "../../components/OtherUserProfile";

interface ProfilePageProps {
  searchParams: { userId?: string };
}

const OtherUserProfile = async ({ searchParams }: ProfilePageProps) => {
  const profileUserId: any = searchParams?.userId;

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Error: User not authenticated</div>;
  }

  let profileUser: any;
  let currentUser;

  try {
    profileUser = await fetchAnyUser(profileUserId);
    currentUser = await fetchUserData(token);
  } catch (error) {
    console.error("Failed to load profile user", error);
    return <div>Error loading profile</div>;
  }

  return (
    <OtherUserProfileComponent
      profileUser={profileUser.user}
      currentUser={currentUser.user}
    />
  );
};

export default OtherUserProfile;