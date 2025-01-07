import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Pizzas from './components/Pizzas';
import Order from './components/Order';

import pizzaImage from './static/logo/freddy_logo.jpg';

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

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
    <Router>
      <div>
        <div>
          {!userId ? (
            <>
              <Link to="/register">
                <button>Register</button>
              </Link>
              <Link to="/login">
                <button>Login</button>
              </Link>
              <Link to="/pizzas">
                <button>Pizzas</button>
              </Link>
            </>
          ) : (
            <>
               <Link to="/pizzas">
                <button>Pizzas</button>
              </Link>
              <Link to="/order">
                <button>My Order</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img
            src={pizzaImage}
            alt="Pizza Image"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/pizzas" element={<Pizzas />} />
        <Route path="/order" element={userId ? <Order userId={userId} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;