"use client";
import { useState } from "react";

const ProfilePicture = () => {
  const [selectedPicture, setSelectedPicture] = useState(
    "/assets/profile-pics/default-avatar.png"
  );

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
        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture", error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-96 p-4 justify-center items-center">
        <h1 className="font-bold italic text-textcolor text-2xl pb-6">
          Select Profile Picture
        </h1>
        <div className="w-96 h-64 overflow-y-scroll p-2 shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)] rounded-md"> 
          <div className="flex flex-wrap justify-center">
            {presetImages.map((image) => (
              <div
                key={image}
                onClick={() => setSelectedPicture(image)}
                className={`cursor-pointer p-1 rounded-full ${
                  selectedPicture === image ? "border-inset border-light-btn" : ""
                }`}
              >
                <img
                  src={image}
                  alt="Avatar"
                  className={`w-28 h-28 rounded-full border-4 ${
                    selectedPicture === image ? "border-inset border-logo" : "border-icon"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleUpdateProfilePicture}
          className="mt-4 w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfilePicture;