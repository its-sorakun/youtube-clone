import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get channel by ID
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('videos');
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new channel (requires auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { channelName, description, channelBanner, channelAvatar } = req.body;
    
    const newChannel = new Channel({
      channelName,
      description,
      channelBanner,
      channelAvatar,
      owner: req.user.id
    });
    
    await newChannel.save();
    
    // Add channel to user's channels array and sync avatar
    await User.findByIdAndUpdate(req.user.id, { 
      $push: { channels: newChannel._id },
      $set: { avatar: channelAvatar }
    });
    
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
