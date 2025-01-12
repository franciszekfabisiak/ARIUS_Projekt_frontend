import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Rate() {
  const [rating, setRating] = useState(0);  // State for rating (0-10)
  const [comment, setComment] = useState(''); // State for comment
  const [orderId, setOrderId] = useState(null); // Store order_id
  const [userId, setUserId] = useState(null); // Store user_id from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    // Get order_id and user_id from localStorage
    const storedOrderId = localStorage.getItem('order_id');
    const storedUserId = localStorage.getItem('userId');
    
    setOrderId(storedOrderId);
    setUserId(storedUserId);
    
    console.log("Stored userId in useEffect:", storedUserId); // Check if userId is correct
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("userId before submitting:", userId);
    console.log("orderId before submitting:", orderId);

    if (!userId || !orderId) {
      alert("Please log in and place an order before rating.");
      return;
    }
    console.log("userId after if:", userId);

    const data = {
      user_id: userId,
      order_id: orderId,
      rating,
      comment,
    };

    console.log("userId after const data:", userId);

    try {
      const response = await axios.post('http://localhost:5000/rate', data);
      if (response.status === 201) {
        alert("Thank you for your feedback!");
        console.log("userId befor navigate:", userId);
        navigate('/pizzas'); // Redirect back to home or another page after successful submission
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit your rating. Please try again.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rate the Pizzeria</h2>
      <form onSubmit={handleSubmit}>
        {/* Rating input */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            Rating (0-10):
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Math.min(10, Math.max(0, e.target.value)))}
              min="0"
              max="10"
              style={{ marginLeft: '10px', padding: '5px', width: '50px' }}
            />
          </label>
        </div>

        {/* Comment input */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your feedback"
              style={{
                marginLeft: '10px',
                padding: '5px',
                width: '300px',
                height: '100px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
}

export default Rate;
