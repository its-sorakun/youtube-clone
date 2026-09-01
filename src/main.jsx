import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Channel from './pages/Channel.jsx';
import ChannelDashboard from './pages/ChannelDashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/video/:id',
        element: <VideoPlayer />
      },
      {
        path: '/channel/my-channel',
        element: <ChannelDashboard />
      },
      {
        path: '/channel/:id',
        element: <Channel />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
