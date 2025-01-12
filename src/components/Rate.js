import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Rate.css';

function Rate() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderId = localStorage.getItem('order_id');
    const storedUserId = localStorage.getItem('userId');
    
    setOrderId(storedOrderId);
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !orderId) {
      alert("Please log in and place an order before rating.");
      return;
    }

    const data = {
      user_id: userId,
      order_id: orderId,
      rating,
      comment,
    };

    try {
      const response = await axios.post('http://localhost:5000/rate', data);
      if (response.status === 201) {
        alert("Thank you for your feedback!");
        navigate('/pizzas');
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit your rating. Please try again.");
    }
  };

  return (
    <div className="rate-container">
      <h2 className="rate-header">Rate the Pizzeria</h2>
      <form className="rate-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Rating (0-10)
          </label>
          <input
            type="number"
            className="rating-input"
            value={rating}
            onChange={(e) => setRating(Math.min(10, Math.max(0, e.target.value)))}
            min="0"
            max="10"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Comment
          </label>
          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your feedback"
          />
        </div>

        <button
          type="submit"
          className="rate-submit-button"
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
}

export default Rate;
