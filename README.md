# YouTube Clone Project

A full-stack video sharing web application built using the MERN (MongoDB, Express, React, Node.js) stack. This project replicates core functionalities of YouTube, including video discovery, playback, channel management, commenting, and user interactions.

## 🚀 Features

- **User Authentication**: Secure signup and login using JSON Web Tokens (JWT) and password hashing (bcrypt).
- **Video Discovery**: Browse videos by categories, use the search bar, or explore the home feed.
- **Video Playback**: Watch videos with an intuitive player interface.
- **Interactivity (Likes & Dislikes)**: Users can like or dislike videos and comments.
- **Nested Comments**: Robust commenting system supporting root comments and 1-level deep replies.
- **Channel Dashboard**: Dedicated pages for channels to view their uploaded videos and subscriber counts.
- **Dark Mode**: Fully responsive dark mode UI implemented with Tailwind CSS.

## 🛠️ Technology Stack

**Frontend:**
- **React 19** (Vite)
- **Redux Toolkit** (State Management)
- **React Router** (Navigation)
- **Tailwind CSS** (Styling & Responsive Design)
- **Axios** (API Requests)

**Backend:**
- **Node.js & Express** (Server & API Routing)
- **MongoDB & Mongoose** (Database & Object Data Modeling)
- **JSON Web Tokens (JWT)** (Stateless Authentication)

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or a MongoDB Atlas URI)

## 💻 Getting Started

Follow these instructions to set up the project locally.

### 1. Clone the repository

```bash
git clone <repository-url>
cd ytclone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ytclone
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend development server:
```bash
npm run dev
```
The API server will be running on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the root directory of the project:

```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will be running on `http://localhost:5173`.

## 📁 Folder Structure

```
ytclone/
├── backend/                  # Express API Server
│   ├── middleware/           # JWT verification
│   ├── models/               # Mongoose schemas (User, Video, Comment, Channel)
│   ├── routes/               # API endpoints
│   └── server.js             # Entry point
├── src/                      # React Frontend
│   ├── api/                  # Axios configuration and interceptors
│   ├── components/           # Reusable UI components (Sidebar, Header, Comments)
│   ├── pages/                # Route views (Home, VideoPlayer, Channel)
│   ├── store/                # Redux slices (authSlice)
│   ├── App.jsx               # Main application routing
│   └── main.jsx              # React DOM render entry
└── ...
```

## 🔌 API Endpoints Summary

- **Authentication:** `POST /api/auth/register`, `POST /api/auth/login`
- **Videos:** `GET /api/videos`, `GET /api/videos/:id`, `POST /api/videos`, `PUT /api/videos/:id/like`, `PUT /api/videos/:id/dislike`
- **Comments:** `GET /api/comments/video/:videoId`, `POST /api/comments`, `PUT /api/comments/:id/like`
- **Channels:** `GET /api/channels/:id`, `POST /api/channels`

## 📝 License

This project is submitted as an academic/learning assignment. All rights reserved.
