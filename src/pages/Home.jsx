import React, { useState } from 'react';
import { categories, mockVideos } from '../data/mockData.js';
import VideoCard from '../components/VideoCard.jsx';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = activeCategory === 'All' 
    ? mockVideos 
    : mockVideos.filter(video => video.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Category Filter Bar */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === category 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {filteredVideos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
