import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
import Comment from './models/Comment.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ytclone';

// Mock Data
import { mockVideos, mockChannels } from '../src/data/mockData.js';

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    await Comment.deleteMany();
    
    console.log('Cleared existing database.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create a fallback user and channel for orphaned videos
    const fallbackUser = new User({
      username: 'SystemSeeder',
      email: 'seeder@system.com',
      password: hashedPassword
    });
    await fallbackUser.save();

    const fallbackChannel = new Channel({
      channelName: "Extra Videos",
      description: "Fallback for orphaned mock data",
      owner: fallbackUser._id
    });
    await fallbackChannel.save();
    fallbackUser.channels.push(fallbackChannel._id);
    await fallbackUser.save();
    console.log('Created fallback seeder user and channel.');

    // Seed mockChannels to MongoDB
    const channelMap = {}; // Map mock channelId to MongoDB _id
    const userMap = {}; // Map mock channelId to MongoDB User _id
    
    for (const mc of mockChannels) {
      const sanitizedName = mc.channelName.replace(/\s+/g, '');
      const user = new User({
        username: sanitizedName,
        email: `${sanitizedName.toLowerCase()}@system.com`,
        password: hashedPassword
      });
      await user.save();

      const channel = new Channel({
        channelName: mc.channelName,
        description: mc.description,
        channelBanner: mc.bannerUrl, // Might be undefined, which triggers default
        owner: user._id,
        subscribers: mc.subscribers || 1000
      });
      await channel.save();
      channelMap[mc.channelId] = channel._id;
      userMap[mc.channelId] = user._id;
      
      user.channels.push(channel._id);
      await user.save();
    }
    console.log('Seeded unique users and channels.');

    // Seed mockVideos
    for (const mv of mockVideos) {
      // Find the corresponding channel ObjectId in our map, or use fallback
      const channelId = channelMap[mv.channelId] || fallbackChannel._id;
      const uploaderId = userMap[mv.channelId] || fallbackUser._id;

      const video = new Video({
        title: mv.title,
        description: mv.description || 'No description provided.',
        videoUrl: mv.videoUrl,
        thumbnailUrl: mv.thumbnailUrl,
        category: mv.category || 'All',
        views: mv.views,
        likes: mv.likes,
        uploader: uploaderId,
        channelId: channelId
      });
      await video.save();

      // Add video to channel
      await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });

      // If it has comments, seed them
      if (mv.comments && mv.comments.length > 0) {
        for (const mc of mv.comments) {
          const comment = new Comment({
            text: mc.text,
            videoId: video._id,
            userId: fallbackUser._id // Just use fallback user for mock comments to keep it simple
          });
          await comment.save();
        }
      }
    }
    console.log('Seeded videos and comments.');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
