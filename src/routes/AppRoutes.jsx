import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../auth/UserRegister';
import ChooseRegister from '../auth/ChooseRegister';
import UserLogin from '../auth/UserLogin';
import FoodPartnerRegister from '../auth/FoodPartnerRegister';
import FoodPartnerLogin from '../auth/FoodPartnerLogin';
import Home from '../general/Home';
import Saved from '../general/saved.jsx';
import BottomNav from '../components/BottomNav';
import CreateFood from '../food-partner/CreateFood';
import Profile from '../food-partner/Profile';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/" element={<><Home /><BottomNav /></>} />
                <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                <Route path="/create-food" element={<CreateFood />} />
                <Route path="/food-partner/:id" element={<Profile />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes