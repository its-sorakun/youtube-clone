import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../data/mockData.js';
import VideoCard from '../components/VideoCard.jsx';
import api from '../api/axios.js';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        
        const res = await api.get('/videos', { params });
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [activeCategory, searchQuery]);

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
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#272727] dark:text-white dark:hover:bg-[#3f3f3f]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          No videos found for this category.
        </div>
      )}
    </div>
  );
};

export default Home;
