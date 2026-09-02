import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarExpanded } from '../store/sidebarSlice';
import Comments from '../components/Comments.jsx';
import api from '../api/axios.js';

const VideoPlayer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setSidebarExpanded(false));
    
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const [videoRes, commentsRes, recommendedRes] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get(`/comments/video/${id}`),
          api.get('/videos')
        ]);
        
        setVideo(videoRes.data);
        setComments(commentsRes.data);
        setRecommended(recommendedRes.data.filter(v => v._id !== id));
      } catch (err) {
        console.error("Failed to fetch video data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!video) {
    return <div className="p-4 text-center">Video not found.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2 md:p-6 max-w-7xl mx-auto">
      {/* Main Video Section */}
      <div className="flex-1 w-full lg:w-[70%]">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          {(() => {
            // Check if it's a YouTube URL and extract the ID
            const getYouTubeId = (url) => {
              if (!url) return null;
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
              const match = url.match(regExp);
              return (match && match[2].length === 11) ? match[2] : null;
            };

            const ytId = getYouTubeId(video.videoUrl);

            if (ytId) {
              return (
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              );
            } else {
              return (
                <video 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                  src={video.videoUrl}
                ></video>
              );
            }
          })()}
        </div>
        
        <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900">{video.title}</h1>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <Link to={`/channel/${video.channelId?._id || 'unknown'}`}>
              <img 
                src={video.uploader?.avatar || 'https://picsum.photos/150'} 
                alt="Channel Avatar" 
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link to={`/channel/${video.channelId?._id || 'unknown'}`}>
                <h3 className="font-semibold text-gray-900 leading-tight hover:text-gray-700">
                  {video.channelId?.channelName || video.uploader?.username || 'Unknown Channel'}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 leading-tight">
                {video.channelId?.subscribers?.toLocaleString() || 0} subscribers
              </p>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-full font-medium ml-4 hover:bg-gray-800">
              Subscribe
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-full">
              <button 
                onClick={async () => {
                  try {
                    const res = await api.put(`/videos/${id}/like`);
                    setVideo(prev => ({ ...prev, likes: res.data.likes, likedBy: res.data.likedBy, dislikes: res.data.dislikes, dislikedBy: res.data.dislikedBy }));
                  } catch (err) {
                    alert("Please log in to like this video");
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-l-full border-r border-gray-300 font-medium text-sm ${video.likedBy?.includes(user?.id || user?._id) ? 'text-blue-600 bg-gray-200' : ''}`}
              >
                <svg className="w-5 h-5" fill={video.likedBy?.includes(user?.id || user?._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                {video.likes}
              </button>
              <button 
                onClick={async () => {
                  try {
                    const res = await api.put(`/videos/${id}/dislike`);
                    setVideo(prev => ({ ...prev, likes: res.data.likes, likedBy: res.data.likedBy, dislikes: res.data.dislikes, dislikedBy: res.data.dislikedBy }));
                  } catch (err) {
                    alert("Please log in to dislike this video");
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-r-full font-medium text-sm ${video.dislikedBy?.includes(user?.id || user?._id) ? 'text-blue-600 bg-gray-200' : ''}`}
              >
                <svg className="w-5 h-5" fill={video.dislikedBy?.includes(user?.id || user?._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                {video.dislikes}
              </button>
            </div>
          </div>
        </div>
        
        {/* Description Box */}
        <div className="bg-gray-100 rounded-xl p-4 mt-2">
          <p className="font-medium text-sm text-gray-900 mb-1">
            {video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <Comments comments={comments} videoId={id} setComments={setComments} />
        </div>
      </div>
      
      {/* Recommended Videos (Sidebar on desktop) */}
      <div className="w-full lg:w-[30%] flex flex-col gap-3">
        {recommended.slice(0, 5).map(relatedVideo => (
          <Link to={`/video/${relatedVideo._id}`} key={relatedVideo._id} className="flex gap-2 group">
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
              <p className="text-xs text-gray-600 mt-1">{relatedVideo.uploader?.username || 'Unknown'}</p>
              <p className="text-xs text-gray-600">{relatedVideo.views?.toLocaleString() || 0} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
