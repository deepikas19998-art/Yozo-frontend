import React, { useEffect, useState } from 'react';
import '../styles/reels.css';
import axios from 'axios';
import ReelFeed from '../components/ReelFeed';

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  useEffect(() => {
    const fetchSavedFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food/save`,
          { withCredentials: true }
        );

        const savedFoods = response.data.savedFoods.map(item => ({
          _id: item.food._id,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          commentsCount: item.food.commentsCount,
          foodPartner: item.food.foodPartner,
        }));

        setVideos(savedFoods);
      } catch (err) {
        console.error("Error fetching saved foods:", err.response?.data || err);
        setError("Failed to fetch saved videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFoods();
  }, []);

  const removeSaved = async (item) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );

      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) }
            : v
        )
      );
    } catch (err) {
      console.error("Error removing saved food:", err.response?.data || err);
      alert("Failed to remove saved video");
    }
  };

  if (loading) {
    return <div className="loading">Loading saved videos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <ReelFeed
      videos={videos}          // prop name consistent with ReelFeed
      onSave={removeSaved}
      emptyMessage="No saved videos yet."
    />
  );
};

export default Saved;