import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';


const CommentsModel = ({ food, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Comments fetch karo
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food/${food._id}/comments`,
          { withCredentials: true }
        );
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Error fetching comments:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
    // Modal open hone par input focus karo
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [food._id]);

  // Overlay click se close karo
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Comment submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/comment`,
        { foodId: food._id, text },
        { withCredentials: true }
      );
      setComments(prev => [res.data.comment, ...prev]);
      setText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Comment post karne mein error aaya');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'abhi';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="cm-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Comments">
      <div className="cm-sheet">
        {/* Handle bar */}
        <div className="cm-handle" />

        {/* Header */}
        <div className="cm-header">
          <span className="cm-title">Comments</span>
          <button className="cm-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comment list */}
        <div className="cm-list" ref={listRef}>
          {loading && <p className="cm-empty">Comments load ho rahe hain...</p>}
          {!loading && comments.length === 0 && (
            <p className="cm-empty">Pehle comment karo! 👇</p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="cm-item">
              <div className="cm-avatar" aria-hidden="true">
                {c.user?.fullName?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="cm-body">
                <div className="cm-meta">
                  <span className="cm-name">{c.user?.fullName || 'User'}</span>
                  <span className="cm-time">{formatTime(c.createdAt)}</span>
                </div>
                <p className="cm-text">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form className="cm-form" onSubmit={handleSubmit}>
          <div className="cm-input-row">
            <input
              ref={inputRef}
              className="cm-input"
              type="text"
              placeholder="Comment likho..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              autoComplete="off"
            />
            <button
              className="cm-send"
              type="submit"
              disabled={!text.trim() || submitting}
              aria-label="Send"
            >
              {submitting ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" opacity=".3" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2.5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsModel;