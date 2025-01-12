import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("storedUserData", localStorage.getItem('userData'));
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      localStorage.setItem('userId', response.data.userId);
      onLogin(response.data.message, response.data.userId);
      console.log("storedUserData", localStorage.getItem('userData'));
      navigate('/pizzas');
    } catch (error) {
      setErrorMessage('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Login</h2>
      {errorMessage && <div className="login-error">{errorMessage}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
