import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Pizzas from './components/Pizzas';
import Cart from './components/Cart';
import Account from './components/Account';
import Rate from './components/Rate';
import { useNavigate } from 'react-router-dom';

import pizzaImage from './static/logo/freddy_logo.jpg';

import './style.css';



function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [loginMessage, setLoginMessage] = useState('');
  const location = useLocation(); // Hook to get current location
  const navigate = useNavigate();

  const handleLogin = (message, id) => {
    setLoginMessage(message);  // Set the login message
    localStorage.setItem('userId', id); // Save the userId after login
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear userId when logging out
    navigate('/pizzas');
    setUserId(null);
    setLoginMessage('');  // Reset login message on logout
  };

  return (
    <div>
      {/* Display login message after login */}
      {loginMessage && <div className="login-message">{loginMessage}</div>}

      <div>
        {/* Show navigation buttons only if not on /rate */}
        {location.pathname !== '/rate' && (
          <div>
            {!userId ? (
              <>
                <Link to="/register">
                  <button className="button" id="register-modal">Register</button>
                </Link>
                <Link to="/login">
                  <button className="button" id="login-modal">Login </button>
                </Link>
                <Link to="/pizzas">
                  <button className="button" id="pizzas-modal">Pizzas</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/pizzas">
                  <button className="button" id="pizzas-modal">Pizzas</button>
                </Link>
                <Link to="/cart">
                  <button className="button" id="cart-modal">Cart</button>
                </Link>
                <Link to="/account">
                  <button className="button" id="account-modal">My Account</button>
                </Link>
                <button className="button logout" id="loguot-modal" onClick={handleLogout}>Logout</button>
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
