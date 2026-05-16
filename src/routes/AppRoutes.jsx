import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


import ChooseRegister from '../auth/ChooseRegister';
import UserRegister from '../auth/UserRegister';
import UserLogin from '../auth/UserLogin';
import FoodPartnerRegister from '../auth/FoodPartnerRegister';
import FoodPartnerLogin from '../auth/FoodPartnerLogin';

import Home from '../general/Home';
import Saved from '../general/saved';

import FoodPartnerHome from '../food-partner/FoodPartnerHome';
import CreateFood from '../food-partner/CreateFood';
import Profile from '../food-partner/Profile';

import BottomNav from '../components/BottomNav';

// ─── Protected route wrappers ─────────────────────────────────────────────────

const ProtectedUserRoute = ({ children }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  if (role !== 'user') return <Navigate to="/user/login" replace />;
  return <>{children}</>;
};

const ProtectedFPRoute = ({ children }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  if (role !== 'food-partner') return <Navigate to="/food-partner/login" replace />;
  return <>{children}</>;
};

const Loader = () => (
  <div style={{
    display: 'grid', placeItems: 'center',
    height: '100dvh', background: '#000', color: '#fff'
  }}>
    <p>Loading...</p>
  </div>
);

// ─── Routes ───────────────────────────────────────────────────────────────────

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public / Auth routes */}
        <Route path="/" element={<ChooseRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

        {/* ─── User routes (protected) ─── */}
        <Route path="/home" element={
          <ProtectedUserRoute>
            <Home />
            <BottomNav />
          </ProtectedUserRoute>
        } />
        <Route path="/saved" element={
          <ProtectedUserRoute>
            <Saved />
            <BottomNav />
          </ProtectedUserRoute>
        } />

        {/* ─── Food Partner routes (protected) ─── */}
        <Route path="/food-partner/home" element={
          <ProtectedFPRoute>
            <FoodPartnerHome />
            <BottomNav />
          </ProtectedFPRoute>
        } />
        <Route path="/create-food" element={
          <ProtectedFPRoute>
            <CreateFood />
          </ProtectedFPRoute>
        } />

        {/* ─── Public profile ─── */}
        <Route path="/food-partner/:id" element={<Profile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;