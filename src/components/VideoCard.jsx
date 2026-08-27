import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <div className="flex flex-col cursor-pointer">
      <Link to={`/video/${video.videoId || video._id}`}>
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full rounded-xl aspect-video object-cover hover:rounded-none transition-all duration-200"
        />
      </Link>
      <div className="flex mt-3 gap-3">
        {/* Mock Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex flex-col">
          <Link to={`/video/${video.videoId || video._id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
              {video.title}
            </h3>
          </Link>
          <Link to={`/channel/${video.channelId || 'unknown'}`} className="text-sm text-gray-600 mt-1 hover:text-gray-900">
            {video.uploader?.username || video.channelName || 'Unknown Channel'}
          </Link>
          <div className="text-sm text-gray-600">
            {video.views} views • {new Date(video.uploadDate || video.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
