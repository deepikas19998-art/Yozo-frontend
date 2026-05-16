import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const FoodPartnerHome = () => {
  const { foodPartner, logout } = useAuth();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [stats, setStats] = useState({ totalVideos: 0, totalLikes: 0, totalSaves: 0 });
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food/partner`,
          { withCredentials: true }
        );
        setFoodItems(res.data.foodItems || []);
        setStats(res.data.stats || { totalVideos: 0, totalLikes: 0, totalSaves: 0 });
      } catch (err) {
        console.error('Dashboard load error:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/logout`,
        { withCredentials: true }
      );
    } catch {}
    logout();
    navigate('/');
  };

  return (
    <div className="fp-home">
      {/* ─── Header / Profile section ─────────────────────────────────────────── */}
      <div className="fp-header">
        <div className="fp-meta">
          <div className="fp-avatar" aria-hidden="true">
            {foodPartner?.name?.[0]?.toUpperCase() || '🍴'}
          </div>
          <div className="fp-info">
            <h1 className="fp-name">{foodPartner?.name || 'Food Partner'}</h1>
            <p className="fp-address">📍 {foodPartner?.address || ''}</p>
            <p className="fp-contact">📞 {foodPartner?.phone || ''}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="fp-stats">
          <div className="fp-stat">
            <span className="fp-stat-value">{stats.totalVideos}</span>
            <span className="fp-stat-label">Reels</span>
          </div>
          <div className="fp-stat">
            <span className="fp-stat-value">{stats.totalLikes}</span>
            <span className="fp-stat-label">Likes</span>
          </div>
          <div className="fp-stat">
            <span className="fp-stat-value">{stats.totalSaves}</span>
            <span className="fp-stat-label">Saves</span>
          </div>
        </div>

        {/* Actions */}
        <div className="fp-actions">
          <Link to="/create-food" className="fp-btn fp-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Reel
          </Link>
          <button className="fp-btn fp-btn--ghost" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="fp-divider" />

      {/* ─── Video Grid ──────────────────────────────────────────────────────────── */}
      <div className="fp-grid-section">
        <h2 className="fp-grid-title">Meri Reels</h2>

        {loading && (
          <div className="fp-loading">Reels load ho rahi hain...</div>
        )}

        {!loading && foodItems.length === 0 && (
          <div className="fp-empty">
            <p>Abhi koi reel nahi hai!</p>
            <Link to="/create-food" className="fp-btn fp-btn--primary" style={{ marginTop: '12px', display: 'inline-flex' }}>
              Pehli Reel Upload Karo
            </Link>
          </div>
        )}

        {!loading && foodItems.length > 0 && (
          <div className="fp-grid">
            {foodItems.map((v) => (
              <div
                key={v._id}
                className="fp-grid-item"
                onMouseEnter={() => setPlayingId(v._id)}
                onMouseLeave={() => setPlayingId(null)}
              >
                <video
                  className="fp-grid-video"
                  src={v.video}
                  muted
                  playsInline
                  loop
                  ref={(el) => {
                    if (!el) return;
                    playingId === v._id ? el.play().catch(() => {}) : el.pause();
                  }}
                />
                {/* Stats overlay */}
                <div className="fp-grid-overlay">
                  <span>❤️ {v.likeCount || 0}</span>
                  <span>🔖 {v.savesCount || 0}</span>
                </div>
                {/* Video name */}
                <div className="fp-grid-name">{v.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodPartnerHome;