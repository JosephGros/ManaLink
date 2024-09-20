"use client";
import { useEffect, useState } from "react";
import ProfilePicture from "../components/ProfilePicture";
import UpdateUserForm from "../components/UpdateUserForm";
import { CustomLoader } from "../components/CustomLoading";

const UserSettingsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPicture, setIsEditingPicture] = useState(false);

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
    return (
      <div className="flex justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="rounded-md bg-bg2 flex flex-col w-96 p-4">
        <div className="flex flex-col justify-center items-center">
            <div className="relative group w-40 h-40 mb-4">
            <img
                src={
                user.profilePicture || "/assets/profile-pics/default-avatar.png"
                }
                alt="Profile picture"
                className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-background bg-opacity-25 rounded-full flex items-end justify-center">
                <button
                    onClick={() => setIsEditingPicture((prev) => !prev)}
                    className="bg-bg2 bg-opacity-50 text-textcolor py-2 rounded-b-full w-full"
                >
                    {isEditingPicture ? "Cancel" : "Edit"}
                </button>
                </div>
            </div>
            {isEditingPicture && <ProfilePicture />}
            <UpdateUserForm />
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;