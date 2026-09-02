import React, { useState } from 'react';
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
      dispatch(updateUser({ ...user, channels: [...(user.channels || []), res.data._id] }));
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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-medium mb-4">Please log in to manage your channel.</h2>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
          Sign In
        </button>
      </div>
    );
  }

  if (hasChannel) {
    // Show Upload Video Form
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Video</h1>
        <form onSubmit={handleUploadVideo} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Title</label>
              <input type="text" name="title" value={videoFormData.title} onChange={handleVideoChange} required className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Catchy video title" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Description</label>
              <textarea name="description" value={videoFormData.description} onChange={handleVideoChange} className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32 resize-none" placeholder="Tell viewers about your video..." />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Video URL</label>
              <p className="text-xs text-gray-500">Provide a YouTube link or an .mp4 URL</p>
              <input type="url" name="videoUrl" value={videoFormData.videoUrl} onChange={handleVideoChange} required className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="https://youtu.be/..." />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Thumbnail URL</label>
              <input type="url" name="thumbnailUrl" value={videoFormData.thumbnailUrl} onChange={handleVideoChange} required className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="https://picsum.photos/640/360" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Category</label>
              <select name="category" value={videoFormData.category} onChange={handleVideoChange} className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                <option value="Gaming">Gaming</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Tech">Tech</option>
              </select>
            </div>

            <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-100">
              <div className="flex gap-4">
                <button type="button" onClick={() => navigate(-1)} className="font-medium text-gray-600 hover:text-black px-4 py-2">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700">Upload</button>
              </div>
            </div>
          </div>
        </form>
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
