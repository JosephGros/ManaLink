"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NewPlaygroupModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    const response = await fetch("/api/playgroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const playgroup = await response.json();
      router.push(`/playgroups/${playgroup._id}/chat`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-11/12 max-w-lg bg-white p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">Create New Playgroup</h2>
        <input
          type="text"
          placeholder="Playgroup Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button onClick={handleCreate} className="mt-4 bg-btn p-2 rounded-md">
          Create Playgroup
        </button>
        <button className="mt-4 text-danger2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NewPlaygroupModal;