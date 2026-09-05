import express from 'express';
import Comment from '../models/Comment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a specific video
router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment (requires auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { text, videoId, parentId } = req.body;
    
    const newComment = new Comment({
      text,
      videoId,
      userId: req.user.id,
      parentId: parentId || null
    });
    
    await newComment.save();
    
    // Populate user info before returning
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Update a comment (requires auth)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    // Ensure the user actually owns this comment before modifying it
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }
    
    const { text } = req.body;
    comment.text = text;
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username avatar');
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete a comment (requires auth)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a comment
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    if (comment.likes.includes(req.user.id)) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== req.user.id);
    }
    
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username avatar');
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a comment
router.put('/:id/dislike', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    if (comment.dislikes.includes(req.user.id)) {
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.dislikes.push(req.user.id);
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    }
    
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username avatar');
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
