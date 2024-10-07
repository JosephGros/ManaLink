'use client';

import React from 'react';
import PlaygroupLayout from './layout';
import { useParams } from 'next/navigation';

const PlaygroupPage = () => {
  const { playgroupId } = useParams();

  return (
    <PlaygroupLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Playgroup {playgroupId}</h1>
      </div>
    </PlaygroupLayout>
  );
};

export default PlaygroupPage;