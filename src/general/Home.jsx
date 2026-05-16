import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReelFeed from '../components/ReelFeed';
import '../styles/reels.css';

const Home = () => {
  const { isLoading } = useAuth(); 
  const [videos, setVideos] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());   // ← liked videos track karne ke liye
  const [savedIds, setSavedIds] = useState(new Set());   // ← saved videos track karne ke liye

  useEffect(() => {
     if (isLoading) return;
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food`,
          { withCredentials: true }
        );
        setVideos(res.data.foodItems);
      } catch (err) {
        console.error('Failed to fetch videos:', err.response?.data || err);
      }
    };
    fetchVideos();
  }, []);

  // ─── Like / Unlike (optimistic update) ─────────────────────────────────────

  const likeVideo = async (item) => {
    const wasLiked = likedIds.has(item._id);

    // Pehle UI update karo (optimistic)
    setLikedIds(prev => {
      const next = new Set(prev);
      wasLiked ? next.delete(item._id) : next.add(item._id);
      return next;
    });
    setVideos(prev =>
      prev.map(v =>
        v._id === item._id
          ? { ...v, likeCount: (v.likeCount || 0) + (wasLiked ? -1 : 1) }
          : v
      )
    );

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/like`,
        { foodId: item._id },
        { withCredentials: true }
      );
    } catch (err) {
      // Error pe revert karo
      console.error('Like error:', err.response?.data || err);
      setLikedIds(prev => {
        const next = new Set(prev);
        wasLiked ? next.add(item._id) : next.delete(item._id);
        return next;
      });
      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { ...v, likeCount: (v.likeCount || 0) + (wasLiked ? 1 : -1) }
            : v
        )
      );
    }
  };

  // ─── Save / Unsave (optimistic update) ─────────────────────────────────────

  const saveVideo = async (item) => {
    const wasSaved = savedIds.has(item._id);

    // Pehle UI update karo (optimistic)
    setSavedIds(prev => {
      const next = new Set(prev);
      wasSaved ? next.delete(item._id) : next.add(item._id);
      return next;
    });
    setVideos(prev =>
      prev.map(v =>
        v._id === item._id
          ? { ...v, savesCount: (v.savesCount || 0) + (wasSaved ? -1 : 1) }
          : v
      )
    );

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );
    } catch (err) {
      // Error pe revert karo
      console.error('Save error:', err.response?.data || err);
      setSavedIds(prev => {
        const next = new Set(prev);
        wasSaved ? next.add(item._id) : next.delete(item._id);
        return next;
      });
      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { ...v, savesCount: (v.savesCount || 0) + (wasSaved ? 1 : -1) }
            : v
        )
      );
    }
  };

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      likedIds={likedIds}
      savedIds={savedIds}
      emptyMessage="No food yet! 🍽️"
    />
  );
};

export default Home;