"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import closeIcon from "../../../public/assets/Icons/IconColor/cross-circle.png";
import playgroupIcon from "../../../public/assets/Icons/IconColor/dice-d20_1.png";
import memberIcon from "../../../public/assets/Icons/IconColor/users-alt_1.png";
import createPlaygroupIcon from "../../../public/assets/Icons/NavColor/playgroup2.png";

const NewPlaygroupModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [playerLimit, setPlayerLimit] = useState<string>("10");
  const router = useRouter();

  const handleCreate = async () => {
    const response = await fetch("/api/playgroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, playerLimit }),
    });

    if (response.ok) {
      const playgroup = await response.json();
      router.push(`/playgroups/${playgroup._id}?playgroup=${playgroup.name}&playgroupId=${playgroup._id}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-textcolor">
      <div className="w-11/12 max-w-lg bg-bg2 p-6 rounded-md flex flex-col items-center">
        <button
          className="place-self-start w-6 h-6 rounded-full font-bold flex justify-center items-center"
          onClick={onClose}
        >
          <Image
            src={closeIcon}
            alt="Close Icon"
            width={20}
            height={20}
            className="inline-block"
          />
        </button>
        <h2 className="text-3xl font-bold mb-4 flex justify-center">
          New Playgroup
        </h2>
        <div className="relative flex items-center w-64 mb-4">
          <Image
            src={playgroupIcon}
            alt="Playgroup Icon"
            width={24}
            height={24}
            className="absolute left-2"
          />
          <input
            type="text"
            placeholder="Playgroup Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 h-10 mr-2 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor placeholder:opacity-50 text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
          />
        </div>

        <div className="relative flex items-center w-64 mb-4">
          <Image
            src={memberIcon}
            alt="User Icon"
            width={24}
            height={24}
            className="absolute left-2"
          />
          <select
            value={playerLimit}
            onChange={(e) => setPlayerLimit(e.target.value)}
            className="w-full h-10 mr-2 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center placeholder:opacity-50 text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
          >
            {Array.from({ length: 30 }, (_, i) => i + 2).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
            <option value="50">Big Group (50)</option>
            <option value="100">Bigger Group (100)</option>
            <option value="1000">That's alot of friends (1k)</option>
            <option value="10000">There's no way (10k)</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="bg-btn text-nav font-bold p-3 rounded-lg shadow-lg h-10 w-28 flex justify-center items-center"
        >
            Create
          <Image
            src={createPlaygroupIcon}
            alt="User Icon"
            width={24}
            height={24}
            className="ml-2"
          />
        </button>
      </div>
    </div>
  );
};

export default NewPlaygroupModal;