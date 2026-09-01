import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const ChannelDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Find if user already has a channel in our mock data
  const existingChannel = null; // To support editing, we'd need a GET /users/me route which is out of scope for now.

  const [formData, setFormData] = useState({
    channelName: existingChannel?.channelName || '',
    description: existingChannel?.description || '',
    channelBanner: existingChannel?.bannerUrl || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/channels', formData);
      alert("Channel created successfully!");
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create channel: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = () => {
    // Out of scope for this phase since we only implemented POST /channels
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

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {existingChannel ? "Channel Customization" : "Create a Channel"}
      </h1>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col gap-6">
          
          {/* Channel Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="channelName" className="font-semibold text-gray-800">Channel Name</label>
            <p className="text-xs text-gray-500">Choose a name that represents you and your content.</p>
            <input 
              type="text" 
              id="channelName"
              name="channelName"
              value={formData.channelName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Code with John"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-semibold text-gray-800">Description</label>
            <p className="text-xs text-gray-500">Tell viewers about your channel. Your description will appear in the About section of your channel.</p>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32 resize-none"
              placeholder="Tell viewers about your channel..."
            />
          </div>

          {/* Banner URL */}
          <div className="flex flex-col gap-2">
            <label htmlFor="channelBanner" className="font-semibold text-gray-800">Banner Image URL</label>
            <p className="text-xs text-gray-500">This image will appear across the top of your channel.</p>
            <input 
              type="url" 
              id="channelBanner"
              name="channelBanner"
              value={formData.channelBanner}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            {existingChannel ? (
              <button 
                type="button" 
                onClick={handleDelete}
                className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg"
              >
                Delete Channel
              </button>
            ) : (
              <div></div>
            )}
            
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="font-medium text-gray-600 hover:text-black px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700"
              >
                {existingChannel ? "Save Changes" : "Create Channel"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChannelDashboard;
