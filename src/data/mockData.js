// Temporary mock data for UI development until database is seeded
export const categories = [
  "All",
  "Music",
  "Gaming",
  "React Router",
  "Computer programming",
  "Live",
  "News",
  "Sports",
  "Podcasts"
];

export const mockChannels = [
  {
    channelId: "channel01",
    channelName: "Code with John",
    ownerId: "user01",
    avatar: "https://picsum.photos/seed/johndoe/150/150",
    bannerUrl: "https://picsum.photos/seed/codebanner/1200/300",
    description: "I make videos about React, JavaScript, and web development. Subscribe for weekly tutorials!",
    subscribers: 154000
  },
  {
    channelId: "channel02",
    channelName: "ProGamerz",
    ownerId: "gamer01",
    avatar: "https://picsum.photos/seed/gamerpro/150/150",
    bannerUrl: "https://picsum.photos/seed/gamebanner/1200/300",
    description: "The best gaming highlights, let's plays, and reviews.",
    subscribers: 2450000
  },
  {
    channelId: "channel03",
    channelName: "ChillVibes",
    ownerId: "dj01",
    avatar: "https://picsum.photos/seed/djchill/150/150",
    bannerUrl: "https://picsum.photos/seed/chillbanner/1200/300",
    description: "24/7 Lo-Fi beats to relax, study, and code to.",
    subscribers: 5000000
  }
];

export const mockVideos = [
  {
    videoId: "video01",
    title: "Learn React in 30 Minutes",
    thumbnailUrl: "https://picsum.photos/seed/react/640/360",
    videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    description: "A quick tutorial to get started with React.",
    channelId: "channel01",
    channelName: "Code with John",
    uploader: {
      username: "JohnDoe",
      avatar: "https://picsum.photos/seed/johndoe/150/150"
    },
    views: 15200,
    likes: 1023,
    dislikes: 45,
    category: "Computer programming",
    uploadDate: "2024-09-20T10:00:00Z",
    comments: [
      {
        commentId: "comment01",
        userId: "user02",
        text: "Great video! Very helpful.",
        timestamp: "2024-09-21T08:30:00Z"
      }
    ]
  },
  {
    videoId: "video02",
    title: "Top 10 Gaming Moments of 2024",
    thumbnailUrl: "https://picsum.photos/seed/gaming/640/360",
    videoUrl: "https://www.youtube.com/watch?v=kBUir84CjHQ",
    description: "The most epic gaming moments caught on tape.",
    channelId: "channel02",
    channelName: "ProGamerz",
    uploader: {
      username: "GamerPro",
      avatar: "https://picsum.photos/seed/gamerpro/150/150"
    },
    views: 845000,
    likes: 45000,
    dislikes: 120,
    category: "Gaming",
    uploadDate: "2024-10-15T15:30:00Z",
    comments: []
  },
  {
    videoId: "video03",
    title: "Lo-Fi Beats to Code To",
    thumbnailUrl: "https://picsum.photos/seed/lofi/640/360",
    videoUrl: "https://youtu.be/lTRiuFIWV54",
    description: "Chill beats to help you focus.",
    channelId: "channel03",
    channelName: "ChillVibes",
    uploader: {
      username: "DJChill",
      avatar: "https://picsum.photos/seed/djchill/150/150"
    },
    views: 2500000,
    likes: 120000,
    dislikes: 500,
    category: "Music",
    uploadDate: "2024-01-01T00:00:00Z",
    comments: []
  },
  {
    videoId: "video04",
    title: "Breaking News: Tech Conference 2024",
    thumbnailUrl: "https://picsum.photos/seed/news/640/360",
    videoUrl: "https://www.youtube.com/watch?v=8psx0CfRRBw",
    description: "Live coverage of the biggest tech conference.",
    channelId: "channel04",
    channelName: "TechNews Network",
    uploader: {
      username: "NewsAnchor",
      avatar: "https://picsum.photos/seed/newsanchor/150/150"
    },
    views: 54300,
    likes: 800,
    dislikes: 200,
    category: "News",
    uploadDate: "2024-11-05T09:00:00Z",
    comments: []
  },
  {
    videoId: "video05",
    title: "Advanced React Router Hooks",
    thumbnailUrl: "https://picsum.photos/seed/router/640/360",
    videoUrl: "https://www.youtube.com/watch?v=h7MTWLv3xvw",
    description: "Deep dive into React Router.",
    channelId: "channel01",
    channelName: "Code with John",
    uploader: {
      username: "JohnDoe",
      avatar: "https://picsum.photos/seed/johndoe/150/150"
    },
    views: 8900,
    likes: 450,
    dislikes: 12,
    category: "React Router",
    uploadDate: "2024-09-25T14:20:00Z",
    comments: []
  },
  {
    videoId: "video06",
    title: "World Cup Finals Highlights",
    thumbnailUrl: "https://picsum.photos/seed/sports/640/360",
    videoUrl: "https://www.youtube.com/watch?v=6HaHNYjnghE",
    description: "All the best moments from the finals.",
    channelId: "channel05",
    channelName: "SportsCenter",
    uploader: {
      username: "SportsFan",
      avatar: "https://picsum.photos/seed/sportsfan/150/150"
    },
    views: 4500000,
    likes: 300000,
    dislikes: 1500,
    category: "Sports",
    uploadDate: "2024-07-15T20:00:00Z",
    comments: []
  }
];
