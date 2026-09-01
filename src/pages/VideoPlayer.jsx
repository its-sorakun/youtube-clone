import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SidebarContext } from '../context/SidebarContext.jsx';
import { mockVideos } from '../data/mockData.js';
import Comments from '../components/Comments.jsx';

const VideoPlayer = () => {
  const { id } = useParams();
  const { setIsExpanded } = useContext(SidebarContext);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Automatically collapse sidebar when entering video player
    setIsExpanded(false);
    
    // Find the video in our mock data
    const foundVideo = mockVideos.find(v => v.videoId === id);
    setVideo(foundVideo);
  }, [id, setIsExpanded]);

  if (!video) {
    return <div className="p-4 text-center">Loading video...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2 md:p-6 max-w-7xl mx-auto">
      {/* Main Video Section */}
      <div className="flex-1 w-full lg:w-[70%]">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <video 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
            src={video.videoUrl}
          ></video>
        </div>
        
        <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900">{video.title}</h1>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <Link to={`/channel/${video.channelId}`}>
              <img 
                src={video.uploader?.avatar || 'https://via.placeholder.com/150'} 
                alt="Channel Avatar" 
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link to={`/channel/${video.channelId}`}>
                <h3 className="font-semibold text-gray-900 leading-tight hover:text-gray-700">
                  {video.channelName}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 leading-tight">1.2M subscribers</p>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-full font-medium ml-4 hover:bg-gray-800">
              Subscribe
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-full">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-l-full border-r border-gray-300 font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                {video.likes}
              </button>
              <button className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-r-full font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Description Box */}
        <div className="bg-gray-100 rounded-xl p-4 mt-2">
          <p className="font-medium text-sm text-gray-900 mb-1">
            {video.views.toLocaleString()} views • {new Date(video.uploadDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <Comments comments={video.comments} />
        </div>
      </div>
      
      {/* Recommended Videos (Sidebar on desktop) */}
      <div className="w-full lg:w-[30%] flex flex-col gap-3">
        {mockVideos.filter(v => v.videoId !== id).slice(0, 5).map(relatedVideo => (
          <Link to={`/video/${relatedVideo.videoId}`} key={relatedVideo.videoId} className="flex gap-2 group">
            <div className="w-40 flex-shrink-0">
              <img 
                src={relatedVideo.thumbnailUrl} 
                alt={relatedVideo.title} 
                className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200" 
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
                {relatedVideo.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1">{relatedVideo.channelName}</p>
              <p className="text-xs text-gray-600">{relatedVideo.views.toLocaleString()} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
