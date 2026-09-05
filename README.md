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

## 📸 Screenshots

### Home Page
![Home Page](https://imgh.in/host/cdustt)

### Channel Dashboard
![Channel Dashboard](https://imgh.in/host/dkbvam)

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

### Quick Start (Automated)

Automation scripts are included that handle cloning, installing dependencies, seeding the database, and starting both servers.

**1. Create the `.env` file**

After cloning, create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ytclone
JWT_SECRET=your_super_secret_jwt_key
```

**2. Run the setup script**

**Windows (PowerShell):**
```powershell
.\run.ps1
```

**macOS / Linux:**
```bash
chmod +x run.sh
./run.sh
```

The script will install all dependencies, seed the database with sample data, and start both the backend and frontend servers automatically.

---

### Manual Setup

If you prefer to set things up manually:

#### 1. Clone the repository

```bash
git clone https://github.com/its-sorakun/youtube-clone.git
cd youtube-clone
```

#### 2. Install dependencies

```bash
npm install
cd backend
npm install
```

#### 3. Create the `.env` file

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ytclone
JWT_SECRET=your_super_secret_jwt_key
```

#### 4. Seed the database

```bash
node seed.js
cd ..
```

#### 5. Start the servers

Start the backend (from the `backend/` directory):
```bash
npm run dev
```

Open a new terminal at the project root and start the frontend:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000` and the frontend on `http://localhost:5173`.

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
