import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/profile.css';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food-partner/${id}`,
          { withCredentials: true }
        );
        setProfile(res.data.foodPartner);
        setVideos(res.data.foodPartner.foodItems || []);
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100dvh' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100dvh' }}>
        <p>Food partner nahi mila.</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: '12px' }}>Back</button>
      </div>
    );
  }

  return (
    <main className="profile-page">
      {/* ─── Back button ─────────────────────────────────────────────────────── */}
      <button className="profile-back" onClick={() => navigate(-1)} aria-label="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>

      {/* ─── Profile Header ───────────────────────────────────────────────────── */}
      <section className="profile-header">
        <div className="profile-meta">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-initials" aria-hidden="true">
              {profile.name?.[0]?.toUpperCase() || '🍴'}
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-pill profile-business" title="Business Name">
              {profile.name}
            </h1>
            {profile.address && (
              <p className="profile-pill profile-address" title="Address">
                📍 {profile.address}
              </p>
            )}
            {profile.contactName && (
              <p className="profile-pill profile-contact">
                👤 {profile.contactName}
              </p>
            )}
          </div>
        </div>

        {/* ─── Stats ───────────────────────────────────────────────────────────── */}
        <div className="profile-stats" role="list" aria-label="Stats">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-value">{profile.totalMeals ?? videos.length}</span>
            <span className="profile-stat-label">Total Reels</span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-value">{profile.totalLikes ?? 0}</span>
            <span className="profile-stat-label">Total Likes</span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      {/* ─── Videos Grid ──────────────────────────────────────────────────────── */}
      <section className="profile-grid" aria-label="Videos">
        {videos.length === 0 && (
          <div className="profile-empty">Abhi koi reels nahi hain.</div>
        )}

        {videos.map((v) => (
          // ✅ FIX: v.id → v._id (MongoDB uses _id)
          <div
            key={v._id}
            className="profile-grid-item"
            onMouseEnter={() => setHoveredId(v._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <video
              className="profile-grid-video"
              src={v.video}
              muted
              playsInline
              loop
              ref={(el) => {
                if (!el) return;
                hoveredId === v._id ? el.play().catch(() => {}) : el.pause();
              }}
            />
            {/* Overlay with stats on hover */}
            <div className="profile-grid-overlay">
              <span>❤️ {v.likeCount || 0}</span>
            </div>
            <div className="profile-grid-label">{v.name}</div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;