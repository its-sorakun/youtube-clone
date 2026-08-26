import React from 'react';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Channel: {id}</h1>
      {/* Channel banner and videos will go here */}
    </div>
  );
};

export default Channel;
