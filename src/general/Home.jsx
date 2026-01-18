import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../styles/reels.css'
import ReelFeed from "../components/ReelFeed";




const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food`,
          { withCredentials: true }
        );
        console.log(response.data);
        setVideos(response.data.foodItems);
      } catch (error) {
        console.error("Failed to fetch videos:", error.response?.data || error);
      }
    };
    fetchVideos();
  }, []);

  const likeVideo = async (item) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/like`,
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.like) {
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v));
      } else {
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v));
      }
    } catch (error) {
      console.error("Failed to like/unlike video:", error.response?.data || error);
    }
  };

  const saveVideo = async (item) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.save) {
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v));
      } else {
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v));
      }
    } catch (error) {
      console.error("Failed to save/unsave video:", error.response?.data || error);
    }
  };

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available."
    />
  );
};

export default Home;