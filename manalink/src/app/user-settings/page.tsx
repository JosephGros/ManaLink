"use client";
import { useEffect, useState } from "react";
import ProfilePicture from "../components/ProfilePicture";
import UpdateUserForm from "../components/UpdateUserForm";
import CustomLoader from "../components/CustomLoading";
import Image from "next/image";
import BackButton from "../components/BackBtn";
import { useRouter } from "next/navigation";

const UserSettingsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [currentPicture, setCurrentPicture] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setUser(data.user);
        setCurrentPicture(data.user.profilePicture || "/assets/profile-pics/default-avatar.png");
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
    return router.push('/');
  }

  const handlePictureChange = (newPicture: string) => {
    setCurrentPicture(newPicture);
  };

  const handleEditStatus = (editStatus: boolean) => {
    setIsEditingPicture(editStatus);
  }

  return (
    <div className="flex justify-center">
      <div className="rounded-md bg-bg2 flex flex-col w-4/5 max-w-96 p-4">
      <BackButton label="Back" className="text-textcolor rounded-md w-12"/>
        <div className="flex flex-col justify-center items-center">
            <div className="relative group w-40 h-40 mb-4">
            <Image
                src={currentPicture}
                alt="Profile picture"
                layout="fill"
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
            {isEditingPicture ? (
            <ProfilePicture
              initialPicture={currentPicture}
              onPictureChange={handlePictureChange}
              onEditStatus={handleEditStatus}
            />
          ) : (
            <UpdateUserForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;