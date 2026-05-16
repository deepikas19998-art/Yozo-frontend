import React, { useEffect, useState } from 'react';
import '../styles/reels.css';
import axios from 'axios';
import ReelFeed from '../components/ReelFeed';

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedFoods = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food/save`,
          { withCredentials: true }
        );

        // ✅ FIX: Backend ab 200 ke sath [] bhejta hai agar kuch saved nahi
        const savedFoods = (response.data.savedFoods || []).map(item => ({
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
        console.error(
          'Error fetching saved foods:',
          err.response?.data || err.message || err
        );
        setError('Failed to fetch saved videos. Please login first.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFoods();
  }, []);

  // ✅ FIX: Unsave ke baad item ko list se hata do (filter), sirf count mat ghataao
  const removeSaved = async (item) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );

      // Video ko list se remove karo
      setVideos(prev => prev.filter(v => v._id !== item._id));
    } catch (err) {
      console.error(
        'Error removing saved food:',
        err.response?.data || err.message || err
      );
      alert('Failed to remove saved video');
    }
  };

  if (loading) {
    return <div className="loading">Loading saved videos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    // ✅ FIX: "videos" nahi, "items" prop chahiye ReelFeed ko
    <ReelFeed
      items={videos}
      onSave={removeSaved}
      emptyMessage="No saved videos yet."
    />
  );
};

export default Saved;