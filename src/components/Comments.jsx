import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios.js';

const Comments = ({ comments = [], videoId, setComments }) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const user = useSelector((state) => state.auth.user);

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

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !videoId || !user) return;
    
    try {
      const res = await api.post('/comments', { text: replyText, videoId, parentId: replyingToCommentId });
      // Add the new reply to the state array
      setComments(prev => [...prev, res.data]);
      setReplyingToCommentId(null);
      setReplyText('');
    } catch (err) {
      console.error("Failed to post reply", err);
      alert("Failed to post reply. Are you logged in?");
    }
  };

  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  const handleEditSubmit = async (e, commentId) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;
    
    try {
      const res = await api.put(`/comments/${commentId}`, { text: editCommentText });
      // Update the modified comment in the local state list
      setComments(prev => prev.map(c => c._id === commentId ? res.data : c));
      setEditingCommentId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update comment");
    }
  };

  const handleDelete = async (commentId) => {
    // Only delete if the user explicitly confirms it
    if (!window.confirm("Delete this comment?")) return;
    
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-white">{comments.length} Comments</h3>
      
      {/* Add Comment Input */}
      <div className="flex gap-4 mb-8">
        {user ? (
          <img 
            src={user.avatar || "https://picsum.photos/150"} 
            alt="Current user" 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#272727] flex items-center justify-center overflow-hidden flex-shrink-0">
            <svg className="w-7 h-7 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex-1">
          <input 
            type="text" 
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-b border-gray-300 dark:border-[#3f3f3f] focus:border-black dark:focus:border-white outline-none py-1 bg-transparent dark:text-white transition-colors"
          />
          <div className="flex justify-end mt-2">
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full disabled:bg-gray-100 disabled:dark:bg-[#272727] disabled:text-gray-400 disabled:dark:text-gray-600"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {rootComments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <img 
              src={comment.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.username || 'User')}&background=random`} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-[13px] dark:text-white">@{comment.userId?.username || 'unknown'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt || comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              {editingCommentId === comment._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, comment._id)} className="flex flex-col gap-2 mt-1">
                  <input 
                    type="text" 
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="w-full border-b border-gray-300 dark:border-[#3f3f3f] focus:border-black dark:focus:border-white outline-none py-1 bg-transparent dark:text-white text-sm"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingCommentId(null)} className="px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-[#272727] dark:text-white rounded-full">Cancel</button>
                    <button type="submit" disabled={!editCommentText.trim()} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full disabled:bg-gray-100 disabled:dark:bg-[#272727] disabled:text-gray-400">Save</button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{comment.text}</p>
              )}
              
              {!editingCommentId && (
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                  </button>
                  <button 
                    onClick={() => {
                      setReplyingToCommentId(comment._id);
                      setReplyText(`@${comment.userId?.username} `);
                    }}
                    className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#272727] px-3 py-1.5 rounded-full"
                  >
                    Reply
                  </button>
                  {user && (user.id === comment.userId?._id || user._id === comment.userId?._id) && (
                    <>
                      <button onClick={() => { setEditingCommentId(comment._id); setEditCommentText(comment.text); }} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(comment._id)} className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {replyingToCommentId === comment._id && (
                <form onSubmit={handleReplySubmit} className="flex flex-col gap-2 mt-4 ml-2">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full border-b border-gray-300 dark:border-[#3f3f3f] focus:border-black dark:focus:border-white outline-none py-1 bg-transparent dark:text-white text-sm"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setReplyingToCommentId(null)} className="px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-[#272727] dark:text-white rounded-full">Cancel</button>
                    <button type="submit" disabled={!replyText.trim()} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full disabled:bg-gray-100 disabled:dark:bg-[#272727] disabled:text-gray-400">Reply</button>
                  </div>
                </form>
              )}

              {/* Nested Replies */}
              {getReplies(comment._id).length > 0 && (
                <div className="mt-4 flex flex-col gap-4">
                  {getReplies(comment._id).map(reply => (
                    <div key={reply._id} className="flex gap-4">
                      <img 
                        src={reply.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.userId?.username || 'User')}&background=random`} 
                        alt="User Avatar" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-[13px] dark:text-white">@{reply.userId?.username || 'unknown'}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(reply.createdAt || reply.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {editingCommentId === reply._id ? (
                          <form onSubmit={(e) => handleEditSubmit(e, reply._id)} className="flex flex-col gap-2 mt-1">
                            <input 
                              type="text" 
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full border-b border-gray-300 dark:border-[#3f3f3f] focus:border-black dark:focus:border-white outline-none py-1 bg-transparent dark:text-white text-sm"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => setEditingCommentId(null)} className="px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-[#272727] dark:text-white rounded-full">Cancel</button>
                              <button type="submit" disabled={!editCommentText.trim()} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full disabled:bg-gray-100 disabled:dark:bg-[#272727] disabled:text-gray-400">Save</button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{reply.text}</p>
                        )}
                        
                        {!editingCommentId && (
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                            </button>
                            {/* We omit Reply button on replies since we are restricting to 1 level deep */}
                            {user && (user.id === reply.userId?._id || user._id === reply.userId?._id) && (
                              <>
                                <button onClick={() => { setEditingCommentId(reply._id); setEditCommentText(reply.text); }} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                  Edit
                                </button>
                                <button onClick={() => handleDelete(reply._id)} className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline">
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
