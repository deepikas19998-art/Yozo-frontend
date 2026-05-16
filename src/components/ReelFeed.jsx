import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentsModel from "./CommentsModel";
import '../styles/reels.css';

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  likedIds = new Set(),    // ← parent se Set milta hai — liked status track karne ke liye
  savedIds = new Set(),    // ← parent se Set milta hai — saved status track karne ke liye
  emptyMessage = 'No videos yet.'
}) => {
  const videoRefs = useRef(new Map());
  const [commentFood, setCommentFood] = useState(null);  // comment modal ke liye

  // IntersectionObserver — video auto play/pause karta hai jab screen mein aata hai
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { /* autoplay block ignore karo */ });
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );

    videoRefs.current.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return; }
    videoRefs.current.set(id, el);
  };

  return (
    <>
      <div className="reels-page">
        <div className="reels-feed" role="list">
          {items.length === 0 && (
            <div className="empty-state">
              <p>{emptyMessage}</p>
            </div>
          )}

          {items.map((item) => {
            const isLiked = likedIds.has(item._id);
            const isSaved = savedIds.has(item._id);

            return (
              <section key={item._id} className="reel" role="listitem">
                {/* Video */}
                <video
                  ref={setVideoRef(item._id)}
                  className="reel-video"
                  src={item.video}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />

                <div className="reel-overlay">
                  <div className="reel-overlay-gradient" aria-hidden="true" />

                  {/* Right side action buttons */}
                  <div className="reel-actions">

                    {/* Like */}
                    <div className="reel-action-group">
                      <button
                        onClick={onLike ? () => onLike(item) : undefined}
                        className={`reel-action ${isLiked ? 'is-liked' : ''}`}
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24"
                          fill={isLiked ? 'currentColor' : 'none'}
                          stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                        </svg>
                      </button>
                      <div className="reel-action__count">{item.likeCount ?? 0}</div>
                    </div>

                    {/* Save / Bookmark */}
                    <div className="reel-action-group">
                      <button
                        className={`reel-action ${isSaved ? 'is-saved' : ''}`}
                        onClick={onSave ? () => onSave(item) : undefined}
                        aria-label={isSaved ? 'Unsave' : 'Save'}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24"
                          fill={isSaved ? 'currentColor' : 'none'}
                          stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                        </svg>
                      </button>
                      <div className="reel-action__count">{item.savesCount ?? 0}</div>
                    </div>

                    {/* Comment */}
                    <div className="reel-action-group">
                      <button
                        className="reel-action"
                        onClick={() => setCommentFood(item)}
                        aria-label="Comments"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                        </svg>
                      </button>
                      <div className="reel-action__count">{item.commentsCount ?? 0}</div>
                    </div>
                  </div>

                  {/* Bottom content — description + visit store */}
                  <div className="reel-content">
                    {item.foodPartner && (
                      <div className="reel-partner-name">
                        🍽️ {item.foodPartner?.name || ''}
                      </div>
                    )}
                    <p className="reel-description" title={item.description}>
                      {item.description}
                    </p>
                    {item.foodPartner && (
                      <Link
                        className="reel-btn"
                        to={`/food-partner/${item.foodPartner?._id || item.foodPartner}`}
                        aria-label="Visit store"
                      >
                        Visit Store →
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Comments modal */}
      {commentFood && (
        <CommentsModal
          food={commentFood}
          onClose={() => setCommentFood(null)}
        />
      )}
    </>
  );
};

export default ReelFeed;