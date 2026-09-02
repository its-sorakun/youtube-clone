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
        <Link to={`/channel/${video.channelId?._id || video.channelId || 'unknown'}`}>
          <img 
            src={video.channelId?.channelAvatar || video.channelAvatar || video.uploader?.avatar || `https://picsum.photos/seed/${video.channelId?._id || video.channelId || video.uploader?._id || video._id}/150/150`} 
            alt="channel avatar" 
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        </Link>
        <div className="flex flex-col">
          <Link to={`/video/${video.videoId || video._id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
              {video.title}
            </h3>
          </Link>
          <Link to={`/channel/${video.channelId?._id || video.channelId || 'unknown'}`} className="text-sm text-gray-600 mt-1 hover:text-gray-900">
            {video.channelId?.channelName || video.channelName || video.uploader?.username || 'Unknown Channel'}
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
