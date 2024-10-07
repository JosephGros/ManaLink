"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const NewPlaygroupPage = () => {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    const response = await fetch('/api/playgroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const playgroup = await response.json();
      router.push(`/playgroups/${playgroup._id}/chat`);
    }
  };

  return (
    <div>
      <h1>Create a New Playgroup</h1>
      <input
        type="text"
        placeholder="Playgroup Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default NewPlaygroupPage;
