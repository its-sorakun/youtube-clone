import React from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { id } = useParams();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Playing Video: {id}</h1>
      {/* Video element and comments will go here */}
    </div>
  );
};

export default VideoPlayer;
