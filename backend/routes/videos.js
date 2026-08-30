import express from 'express';
import Video from '../models/Video.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all videos (can implement search/filter via query params)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query).populate('uploader', 'username avatar').sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username avatar')
      .populate('channelId', 'channelName subscribers');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    // Increment views (simple implementation)
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create video (requires auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;
    
    const newVideo = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channelId,
      uploader: req.user.id
    });
    
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like video (requires auth)
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id, 
      { $inc: { likes: 1 } }, 
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike video (requires auth)
router.put('/:id/dislike', verifyToken, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id, 
      { $inc: { dislikes: 1 } }, 
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update video (requires auth)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own videos' });
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete video (requires auth)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own videos' });
    }
    
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
