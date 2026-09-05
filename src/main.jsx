import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

const Home = React.lazy(() => import('./pages/Home.jsx'));
const VideoPlayer = React.lazy(() => import('./pages/VideoPlayer.jsx'));
const Channel = React.lazy(() => import('./pages/Channel.jsx'));
const ChannelDashboard = React.lazy(() => import('./pages/ChannelDashboard.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const Register = React.lazy(() => import('./pages/Register.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Suspense fallback={<LoadingFallback />}><Home /></Suspense>
      },
      {
        path: '/video/:id',
        element: <Suspense fallback={<LoadingFallback />}><VideoPlayer /></Suspense>
      },
      {
        path: '/channel/my-channel',
        element: <Suspense fallback={<LoadingFallback />}><ChannelDashboard /></Suspense>
      },
      {
        path: '/channel/:id',
        element: <Suspense fallback={<LoadingFallback />}><Channel /></Suspense>
      },
      {
        path: '/login',
        element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>
      },
      {
        path: '/register',
        element: <Suspense fallback={<LoadingFallback />}><Register /></Suspense>
      },
      {
        path: '*',
        element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>
      }
    ]
  }
]);

import { Provider } from 'react-redux';
import store from './store/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
