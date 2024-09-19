// ProfileSettings.tsx
"use client";
import { useState } from "react";

const ProfileSettings = () => {
  const [selectedPicture, setSelectedPicture] = useState("/assets/profile-pics/default-avatar.png");

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
      <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
        <h1 className="font-bold italic text-textcolor text-4xl pb-6">Select Profile Picture</h1>
        <div className="grid grid-cols-6 gap-4">
          {presetImages.map((image) => (
            <div
              key={image}
              onClick={() => setSelectedPicture(image)}
              className={`cursor-pointer ${
                selectedPicture === image ? "border-2 border-blue-500" : ""
              }`}
            >
              <img src={image} alt="Avatar" className="w-20 h-20 rounded-full" />
            </div>
          ))}
        </div>
        <button
          onClick={handleUpdateProfilePicture}
          className="mt-4 w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg"
        >
          Save Picture
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;