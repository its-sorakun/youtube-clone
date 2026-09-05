import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get subscribed channels for the current user
router.get('/subscribed', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    // Populate both subscriptions and their owners to ensure we have avatars
    const user = await User.findById(userId).populate({
      path: 'subscriptions',
      select: 'channelName channelAvatar subscribers owner',
      populate: {
        path: 'owner',
        select: 'avatar'
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.subscriptions || []);
  } catch (error) {
    console.error("Fetch subscriptions error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Update channel (requires auth)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own channel' });
    }
    
    const { channelName, description, channelBanner, channelAvatar } = req.body;
    
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id, 
      { channelName, description, channelBanner, channelAvatar },
      { new: true }
    )
    .populate('owner', 'username avatar')
    .populate('videos');
    
    // Sync the channel avatar to the user's avatar
    if (channelAvatar) {
      await User.findByIdAndUpdate(req.user.id, { $set: { avatar: channelAvatar } });
    }
    
    res.json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle subscribe to a channel
router.put('/:id/subscribe', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const channel = await Channel.findById(req.params.id);
    const user = await User.findById(userId);

    if (!channel || !user) {
      return res.status(404).json({ message: 'Channel or User not found' });
    }

    // Check if channel is already in user's subscriptions
    const isSubscribed = user.subscriptions && user.subscriptions.some(id => id.toString() === channel._id.toString());

    if (isSubscribed) {
      // Unsubscribe
      await User.findByIdAndUpdate(user._id, { $pull: { subscriptions: channel._id } });
      await Channel.findByIdAndUpdate(channel._id, { $inc: { subscribers: -1 } });
    } else {
      // Subscribe
      await User.findByIdAndUpdate(user._id, { $push: { subscriptions: channel._id } });
      await Channel.findByIdAndUpdate(channel._id, { $inc: { subscribers: 1 } });
    }

    // Return the updated channel subscriber count and user subscriptions array
    const updatedUser = await User.findById(user._id);
    const updatedChannel = await Channel.findById(channel._id);

    res.json({
      subscriptions: updatedUser.subscriptions,
      subscribers: updatedChannel.subscribers
    });
  } catch (error) {
    console.error("Subscribe route error:", error);
    import('fs').then(fs => fs.appendFileSync('debug.log', error.stack + '\n'));
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
