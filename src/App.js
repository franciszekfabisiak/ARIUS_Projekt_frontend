import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Pizzas from './components/Pizzas';
import Order from './components/Order';

function App() {
  const [userId, setUserId] = useState(null);

  const handleLogin = (message, id) => {
    alert(message);
    setUserId(id); // Save the userId after login
  };

  const handleLogout = () => {
    setUserId(null); // Clear userId when logging out
  };

  return (
    <Router>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Pizza Ordering System</h1>
        <div style={{ marginBottom: '20px' }}>
          {!userId ? (
            <>
              <Link to="/register">
                <button style={buttonStyle}>Register</button>
              </Link>
              <Link to="/login">
                <button style={buttonStyle}>Login</button>
              </Link>
              <Link to="/pizzas">
                <button style={buttonStyle}>Pizzas</button>
              </Link>
            </>
          ) : (
            <>
               <Link to="/pizzas">
                <button style={buttonStyle}>Pizzas</button>
              </Link>
              <Link to="/order">
                <button style={buttonStyle}>My Order</button>
              </Link>
              <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<h2>Welcome to the Pizza Ordering App!</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/pizzas" element={<Pizzas />} />
        <Route
          path="/order"
          element={userId ? <Order userId={userId} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

// Button Styling
const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default App;