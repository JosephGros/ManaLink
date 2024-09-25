"use client";
import Image from "next/image";
import { useState } from "react";
interface ProfilePictureProps {
  initialPicture: string;
  onPictureChange: (newPicture: string) => void;
  onEditStatus: (editStatus: boolean) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  initialPicture,
  onPictureChange,
  onEditStatus,
}) => {
  const [selectedPicture, setSelectedPicture] =
    useState<string>(initialPicture);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const presetImages = Array.from({ length: 54 }, (_, i) => {
    return `/assets/profile-pics/avatar${i + 1}.png`;
  });

  const handleUpdateProfilePicture = async () => {
    try {
      const response = await fetch("/api/update-profile-pic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: selectedPicture }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Profile picture updated successfully!");
        handleMessage();
      } else {
        setError("Failed to update profile picture");
        handleMessage();
      }
    } catch (error) {
      console.error("Error updating profile picture", error);
    }
  };

  const handleMessage = () => {
    setShowMessage(true);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col w-fit justify-center items-center">
          <h1 className="font-bold text-textcolor text-2xl pb-6">
            Change Image
          </h1>
          <div className="w-fit h-64 overflow-y-scroll p-2 shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)] rounded-md">
            <div className="flex flex-wrap justify-center">
              {presetImages.map((image) => (
                <div
                  key={image}
                  onClick={() => {
                    setSelectedPicture(image), onPictureChange(image);
                  }}
                  className={`cursor-pointer p-1 rounded-full ${
                    selectedPicture === image
                      ? "border-inset border-light-btn"
                      : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt="Avatar"
                    width={98}
                    height={98}
                    className={`w-28 h-28 rounded-full border-4 ${
                      selectedPicture === image
                        ? "border-inset border-logo"
                        : "border-icon"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleUpdateProfilePicture() }
            className="mt-4 w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg"
          >
            Save
          </button>
        </div>
      </div>

      {showMessage && (
        <div
          onClick={() => setShowMessage(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-11/12 max-w-96 bg-bg2 p-6 rounded-md shadow-lg text-textcolor"
          >
            <div>            
              {message && <p className="font-bold text-textcolor text-center">{message}</p>}
              {error && <p className="font-bold text-textcolor text-center">{error}</p>}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setShowMessage(false);
                  onEditStatus(false);
                }}
                className="bg-btn text-nav font-bold px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
