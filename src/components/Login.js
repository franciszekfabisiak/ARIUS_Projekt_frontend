import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Zaimportuj useNavigate

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Zainicjuj hook navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("storedUserData", localStorage.getItem('userData'));
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      // Przechowuj dane w localStorage
      localStorage.setItem('userId', response.data.userId);

      // Przekaż dane do rodzica
      onLogin(response.data.message, response.data.userId);

      // Po udanym logowaniu przekieruj na stronę /pizzas
      console.log("storedUserData", localStorage.getItem('userData'));
      navigate('/pizzas');
    } catch (error) {
      setErrorMessage('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
