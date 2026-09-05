import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/authSlice';
import VideoCard from '../components/VideoCard.jsx';
import api from '../api/axios.js';

const Channel = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isEditingChannel, setIsEditingChannel] = useState(false);
  const [channelFormData, setChannelFormData] = useState({
    channelName: '',
    description: '',
    channelAvatar: '',
    channelBanner: ''
  });

  const openEditModal = () => {
    setChannelFormData({
      channelName: channel.channelName || '',
      description: channel.description || '',
      channelAvatar: channel.channelAvatar || '',
      channelBanner: channel.channelBanner || ''
    });
    setIsEditingChannel(true);
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/channels/${channel._id}`, channelFormData);
      
      // Update local channel state
      setChannel(res.data);
      
      // If avatar changed, update global user state
      if (channelFormData.channelAvatar && channelFormData.channelAvatar !== channel.channelAvatar) {
        dispatch(updateUser({
          ...user,
          avatar: channelFormData.channelAvatar
        }));
      }
      
      setIsEditingChannel(false);
    } catch (err) {
      console.error("Failed to update channel", err);
      alert("Failed to update channel: " + (err.response?.data?.message || err.message));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.subscribe-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/channels/${id}`);
        setChannel(res.data);
      } catch (err) {
        console.error("Failed to fetch channel", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChannel();
  }, [id]);

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please log in to subscribe");
      return;
    }
    try {
      const res = await api.put(`/channels/${channel._id}/subscribe`);
      
      // Update local channel state
      setChannel(prev => ({
        ...prev,
        subscribers: res.data.subscribers
      }));

      // Update global user state
      dispatch(updateUser({
        ...user,
        subscriptions: res.data.subscriptions
      }));
      
      // Close dropdown if it was open
      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Failed to subscribe", err);
      alert("Failed to subscribe: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!channel) {
    return <div className="p-4 text-center">Channel not found.</div>;
  }

  const channelVideos = channel.videos || [];
  const isSubscribed = user?.subscriptions?.includes(channel._id);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-10">
      {/* Banner */}
      <div className="w-full h-32 md:h-56 overflow-hidden rounded-xl bg-gray-200 dark:bg-[#272727]">
        {channel.channelBanner && (
          <img 
            src={channel.channelBanner} 
            alt="Channel Banner" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6 px-4 md:px-10">
        <img 
          src={channel.channelAvatar || channel.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.channelName)}&background=random`} 
          alt={channel.channelName} 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left mt-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{channel.channelName}</h1>
          <div className="text-gray-600 dark:text-gray-400 mt-1 mb-2">
            <span className="font-medium">@{channel.channelName.replace(/\s+/g, '')}</span>
            <span className="mx-2">•</span>
            <span>{channel.subscribers.toLocaleString()} subscribers</span>
            <span className="mx-2">•</span>
            <span>{channelVideos.length} videos</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 max-w-2xl line-clamp-2">{channel.description}</p>
        </div>
        <div className="mt-4 md:mt-6">
          {user && user.channels?.includes(channel._id) ? (
            <div className="flex gap-3">
              <button onClick={openEditModal} className="bg-gray-200 dark:bg-[#3f3f3f] text-gray-800 dark:text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-[#4f4f4f] transition-colors">
                Customize Channel
              </button>
              <Link to="/channel/my-channel">
                <button className="bg-gray-200 dark:bg-[#3f3f3f] text-gray-800 dark:text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-[#4f4f4f] transition-colors">
                  Manage Videos
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative subscribe-dropdown-container">
              {isSubscribed ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#3f3f3f]"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                  </svg>
                  Subscribed
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={handleSubscribe}
                  className="px-5 py-2.5 rounded-full font-medium transition-colors bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Subscribe
                </button>
              )}
              
              {/* Dropdown Menu */}
              {isDropdownOpen && isSubscribed && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#282828] rounded-xl shadow-lg border border-gray-200 dark:border-transparent overflow-hidden z-50 py-2">
                  <button 
                    onClick={handleSubscribe}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] flex items-center gap-3 text-sm text-gray-900 dark:text-white"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M19 13H5v-2h14v2z"></path>
                    </svg>
                    Unsubscribe
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-[#303030] mt-8 px-4 md:px-10">
        <button 
          onClick={() => setActiveTab('Home')}
          className={`px-6 py-3 font-medium ${activeTab === 'Home' ? 'text-black dark:text-white border-b-2 border-black dark:border-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('Videos')}
          className={`px-6 py-3 font-medium ${activeTab === 'Videos' ? 'text-black dark:text-white border-b-2 border-black dark:border-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          Videos
        </button>
      </div>

      {/* Videos Grid */}
      <div className="px-4 md:px-10 mt-6">
        {channelVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channelVideos.map(video => (
              <VideoCard 
                key={video._id} 
                video={{
                  ...video,
                  uploader: channel.owner,
                  channelName: channel.channelName,
                  channelId: channel._id
                }} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-10">This channel has no videos.</p>
        )}
      </div>

      {/* Edit Channel Modal */}
      {isEditingChannel && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#282828] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-[#303030] flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Customize Channel</h3>
              <button onClick={() => setIsEditingChannel(false)} className="text-gray-500 hover:text-black dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleUpdateChannel} className="p-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-800 dark:text-gray-200">Channel Name</label>
                  <input type="text" value={channelFormData.channelName} onChange={(e) => setChannelFormData({...channelFormData, channelName: e.target.value})} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-800 dark:text-gray-200">Description</label>
                  <textarea value={channelFormData.description} onChange={(e) => setChannelFormData({...channelFormData, description: e.target.value})} className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-800 dark:text-gray-200">Channel Avatar URL</label>
                  <input type="url" value={channelFormData.channelAvatar} onChange={(e) => setChannelFormData({...channelFormData, channelAvatar: e.target.value})} required className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-800 dark:text-gray-200">Channel Banner URL</label>
                  <input type="url" value={channelFormData.channelBanner} onChange={(e) => setChannelFormData({...channelFormData, channelBanner: e.target.value})} className="border border-gray-300 dark:border-[#3f3f3f] bg-transparent dark:text-white rounded-lg p-3 outline-none focus:border-blue-500" />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsEditingChannel(false)} className="px-5 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;
