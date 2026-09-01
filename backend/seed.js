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

    // Create a dummy user to own these channels/videos
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const dummyUser = new User({
      username: 'SystemSeeder',
      email: 'seeder@system.com',
      password: hashedPassword,
      avatar: 'https://via.placeholder.com/150'
    });
    
    await dummyUser.save();
    console.log('Created dummy seeder user.');

    // Seed mockChannels to MongoDB
    const channelMap = {}; // Map mock channelId to MongoDB _id
    for (const mc of mockChannels) {
      const channel = new Channel({
        channelName: mc.channelName,
        description: mc.description,
        channelBanner: mc.bannerUrl,
        owner: dummyUser._id,
        subscribers: mc.subscribers || 1000
      });
      await channel.save();
      channelMap[mc.channelId] = channel._id;
      
      dummyUser.channels.push(channel._id);
    }
    await dummyUser.save();
    console.log('Seeded channels.');

    // Create a fallback channel for orphaned videos
    const fallbackChannel = new Channel({
      channelName: "Extra Videos",
      description: "Fallback for orphaned mock data",
      owner: dummyUser._id
    });
    await fallbackChannel.save();

    // Seed mockVideos
    for (const mv of mockVideos) {
      // Find the corresponding channel ObjectId in our map, or use fallback
      const channelId = channelMap[mv.channelId] || fallbackChannel._id;

      const video = new Video({
        title: mv.title,
        description: mv.description || 'No description provided.',
        videoUrl: mv.videoUrl,
        thumbnailUrl: mv.thumbnailUrl,
        category: mv.category || 'All',
        views: mv.views,
        likes: mv.likes,
        uploader: dummyUser._id,
        channelId: channelId
      });
      await video.save();

      // If the channel exists, add video to channel
      if (channelId) {
        await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });
      }

      // If it has comments, seed them
      if (mv.comments && mv.comments.length > 0) {
        for (const mc of mv.comments) {
          const comment = new Comment({
            text: mc.text,
            videoId: video._id,
            userId: dummyUser._id
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
