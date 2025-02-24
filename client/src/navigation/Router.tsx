import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Home from '../components/Main/Home';
import Profile from '../components/Main/Profile';
import EditProfile from '../components/Main/EditProfile';
import ExternalProfile from '../components/Main/ExternalProfile';
import Messages from '../components/Messages/Messages';
import Post from '../components/Posts/Post';
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />} />
        <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/home" /> : <Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/external-profile/:userId" element={<ExternalProfile />} />
        <Route path="/:userId/:postId" element={<Post />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;
