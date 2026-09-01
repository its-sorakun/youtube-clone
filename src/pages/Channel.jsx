import React from 'react';
import { useParams } from 'react-router-dom';
import { mockChannels, mockVideos } from '../data/mockData.js';
import VideoCard from '../components/VideoCard.jsx';

const Channel = () => {
  const { id } = useParams();
  
  const channel = mockChannels.find(c => c.channelId === id) || {
    channelId: id,
    channelName: "Unknown Channel",
    avatar: "https://via.placeholder.com/150",
    bannerUrl: "https://via.placeholder.com/1200x300",
    description: "This channel does not exist in our mock data.",
    subscribers: 0
  };

  const channelVideos = mockVideos.filter(v => v.channelId === id);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-10">
      {/* Banner */}
      <div className="w-full h-32 md:h-56 overflow-hidden rounded-xl">
        <img 
          src={channel.bannerUrl} 
          alt="Channel Banner" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6 px-4 md:px-10">
        <img 
          src={channel.avatar} 
          alt={channel.channelName} 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
        />
        <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left mt-2">
          <h1 className="text-3xl font-bold text-gray-900">{channel.channelName}</h1>
          <div className="text-gray-600 mt-1 mb-2">
            <span className="font-medium">@{channel.channelName.replace(/\s+/g, '')}</span>
            <span className="mx-2">•</span>
            <span>{channel.subscribers.toLocaleString()} subscribers</span>
            <span className="mx-2">•</span>
            <span>{channelVideos.length} videos</span>
          </div>
          <p className="text-sm text-gray-700 max-w-2xl line-clamp-2">{channel.description}</p>
        </div>
        <div className="mt-4 md:mt-6">
          <button className="bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800">
            Subscribe
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-8 px-4 md:px-10">
        <button className="px-6 py-3 font-medium text-black border-b-2 border-black">Home</button>
        <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900">Videos</button>
        <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900">Playlists</button>
      </div>

      {/* Videos Grid */}
      <div className="px-4 md:px-10 mt-6">
        {channelVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channelVideos.map(video => (
              <VideoCard key={video.videoId} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-10">This channel has no videos.</p>
        )}
      </div>
    </div>
  );
};

export default Channel;
