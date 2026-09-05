import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { updateUser } from '../store/authSlice';

const ChannelDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const hasChannel = user?.channels && user.channels.length > 0;
  const channelId = hasChannel ? user.channels[0] : null;

  const [channelFormData, setChannelFormData] = useState({
    channelName: '',
    description: '',
    channelBanner: '',
    channelAvatar: ''
  });

  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Gaming'
  });

  const handleChannelChange = (e) => {
    setChannelFormData({ ...channelFormData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    setVideoFormData({ ...videoFormData, [e.target.name]: e.target.value });
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/channels', channelFormData);
      alert("Channel created successfully!");
      dispatch(updateUser({ 
        ...user, 
        channels: [...(user.channels || []), res.data._id],
        avatar: channelFormData.channelAvatar
      }));
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create channel: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/videos', {
        ...videoFormData,
        channelId
      });
      alert("Video uploaded successfully!");
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to upload video: " + (err.response?.data?.message || err.message));
    }
  };

  const [myVideos, setMyVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    if (channelId) {
      const fetchChannel = async () => {
        try {
          const res = await api.get(`/channels/${channelId}`);
          setMyVideos(res.data.videos || []);
        } catch (err) {
          console.error("Failed to fetch channel videos", err);
        }
      };
      fetchChannel();
    }
  }, [channelId]);

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video? This cannot be undone.")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      setMyVideos(prev => prev.filter(v => v._id !== videoId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/videos/${editingVideo._id}`, {
        title: editingVideo.title,
        description: editingVideo.description,
        thumbnailUrl: editingVideo.thumbnailUrl,
        category: editingVideo.category
      });
      setMyVideos(prev => prev.map(v => v._id === res.data._id ? res.data : v));
      setEditingVideo(null);
      alert("Video updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update video: " + (err.response?.data?.message || err.message));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-medium mb-4 dark:text-white">Please log in to manage your channel.</h2>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
          Sign In
        </button>
      </div>
    );
  }

  if (hasChannel) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Upload Section */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upload Video</h1>
        <form onSubmit={handleUploadVideo} className="bg-white dark:bg-[#282828] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#303030] mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 dark:text-gray-200">Title</label>
              <input type="text" name="title" value={videoFormData.title} onChange={handleVideoChange} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Catchy video title" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 dark:text-gray-200">Description</label>
              <textarea name="description" value={videoFormData.description} onChange={handleVideoChange} className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500 h-32 resize-none" placeholder="Tell viewers about your video..." />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 dark:text-gray-200">Video URL</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Provide a YouTube link or an .mp4 URL</p>
              <input type="url" name="videoUrl" value={videoFormData.videoUrl} onChange={handleVideoChange} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" placeholder="https://youtu.be/..." />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 dark:text-gray-200">Thumbnail URL</label>
              <input type="url" name="thumbnailUrl" value={videoFormData.thumbnailUrl} onChange={handleVideoChange} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" placeholder="https://picsum.photos/640/360" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 dark:text-gray-200">Category</label>
              <select name="category" value={videoFormData.category} onChange={handleVideoChange} className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="Gaming" className="dark:bg-[#282828]">Gaming</option>
                <option value="Music" className="dark:bg-[#282828]">Music</option>
                <option value="Sports" className="dark:bg-[#282828]">Sports</option>
                <option value="Education" className="dark:bg-[#282828]">Education</option>
                <option value="Entertainment" className="dark:bg-[#282828]">Entertainment</option>
                <option value="Tech" className="dark:bg-[#282828]">Tech</option>
              </select>
            </div>

            <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-100 dark:border-[#303030]">
              <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700">Upload</button>
              </div>
            </div>
          </div>
        </form>

        {/* Manage Videos Section */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Your Videos</h2>
        <div className="bg-white dark:bg-[#282828] rounded-xl shadow-sm border border-gray-200 dark:border-[#303030] overflow-hidden">
          {myVideos.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-[#303030]">
              {myVideos.map(video => (
                <div key={video._id} className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 dark:hover:bg-[#3f3f3f] transition-colors">
                  <img src={video.thumbnailUrl} alt="Thumbnail" className="w-32 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{video.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{new Date(video.createdAt).toLocaleDateString()} • {video.views} views</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => setEditingVideo(video)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteVideo(video._id)} className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              You haven't uploaded any videos yet.
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingVideo && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#282828] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-[#303030] flex justify-between items-center">
                <h3 className="text-xl font-bold dark:text-white">Edit Video</h3>
                <button onClick={() => setEditingVideo(null)} className="text-gray-500 hover:text-black dark:hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <form onSubmit={handleUpdateVideo} className="p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-800 dark:text-gray-200">Title</label>
                    <input type="text" value={editingVideo.title} onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-800 dark:text-gray-200">Description</label>
                    <textarea value={editingVideo.description} onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})} className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-800 dark:text-gray-200">Thumbnail URL</label>
                    <input type="url" value={editingVideo.thumbnailUrl} onChange={(e) => setEditingVideo({...editingVideo, thumbnailUrl: e.target.value})} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-800 dark:text-gray-200">Category</label>
                    <select value={editingVideo.category} onChange={(e) => setEditingVideo({...editingVideo, category: e.target.value})} className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500">
                      <option value="Gaming" className="dark:bg-[#282828]">Gaming</option>
                      <option value="Music" className="dark:bg-[#282828]">Music</option>
                      <option value="Sports" className="dark:bg-[#282828]">Sports</option>
                      <option value="Education" className="dark:bg-[#282828]">Education</option>
                      <option value="Entertainment" className="dark:bg-[#282828]">Entertainment</option>
                      <option value="Tech" className="dark:bg-[#282828]">Tech</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingVideo(null)} className="px-5 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700">Save Changes</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show Create Channel Form
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a Channel</h1>
      <form onSubmit={handleCreateChannel} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Channel Name</label>
            <input type="text" name="channelName" value={channelFormData.channelName} onChange={handleChannelChange} required className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Description</label>
            <textarea name="description" value={channelFormData.description} onChange={handleChannelChange} className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32 resize-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Channel Display Picture (URL)</label>
            <input type="url" name="channelAvatar" value={channelFormData.channelAvatar} onChange={handleChannelChange} required className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="https://picsum.photos/150" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Banner Image URL</label>
            <input type="url" name="channelBanner" value={channelFormData.channelBanner} onChange={handleChannelChange} className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-100">
            <div className="flex gap-4">
              <button type="button" onClick={() => navigate(-1)} className="font-medium text-gray-600 hover:text-black px-4 py-2">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700">Create Channel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChannelDashboard;
