import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Pizzas from './components/Pizzas';
import Cart from './components/Cart';
import Account from './components/Account';
import Rate from './components/Rate';

import pizzaImage from './static/logo/freddy_logo.jpg';

import './style.css';

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const location = useLocation(); // Hook to get current location

  const handleLogin = (message, id) => {
    alert(message);
    localStorage.setItem('userId', id); // Save the userId after login
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear userId when logging out
    setUserId(null);
  };

  return (
    <div>
      <div>
        {/* Show navigation buttons only if not on /rate */}
        {location.pathname !== '/rate' && (
          <div>
            {!userId ? (
              <>
                <Link to="/register">
                  <button className="button">Register</button>
                </Link>
                <Link to="/login">
                  <button className="button">Login</button>
                </Link>
                <Link to="/pizzas">
                  <button className="button">Pizzas</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/pizzas">
                  <button className="button">Pizzas</button>
                </Link>
                <Link to="/cart">
                  <button className="button">Cart</button>
                </Link>
                <Link to="/account">
                  <button className="button">My Account</button>
                </Link>
                <button className="button logout" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img
          src={pizzaImage}
          alt="Pizza Image"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/pizzas" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/pizzas" element={<Pizzas />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/rate" element={<Rate />} />
      </Routes>
    </div>
  );
}

export default function Wrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}