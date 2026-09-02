import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  channelAvatar: {
    type: String,
    required: true
  },
  channelBanner: {
    type: String,
    default: () => `https://picsum.photos/seed/${new mongoose.Types.ObjectId()}/800/200`
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscribers: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);
