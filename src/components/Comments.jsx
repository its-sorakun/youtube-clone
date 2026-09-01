import React, { useState, useContext } from 'react';
import api from '../api/axios.js';
import { AuthContext } from '../context/AuthContext.jsx';

const Comments = ({ comments = [], videoId, setComments }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !videoId || !user) return;
    
    try {
      const res = await api.post('/comments', { text: newComment, videoId });
      setComments(prev => [res.data, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Failed to post comment. Are you logged in?");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{comments.length} Comments</h3>
      
      {/* Add Comment Input */}
      <div className="flex gap-4 mb-8">
        <img 
          src="https://via.placeholder.com/150" 
          alt="Current user" 
          className="w-10 h-10 rounded-full"
        />
        <form onSubmit={handleSubmit} className="flex-1">
          <input 
            type="text" 
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-black outline-none py-1 bg-transparent transition-colors"
          />
          <div className="flex justify-end mt-2">
            <button 
              type="button"
              onClick={() => setNewComment('')}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-full mr-2"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full disabled:bg-gray-100 disabled:text-gray-400"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <img 
              src={comment.userId?.avatar || `https://picsum.photos/seed/${comment.userId?._id}/150/150`} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-[13px]">@{comment.userId?.username || 'unknown'}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt || comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-900">{comment.text}</p>
              
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-gray-600 hover:text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                </button>
                <button className="text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-full">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
