import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [telephone_number, setTelephoneNumber] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !name || !surname || !telephone_number) {
      setModalMessage('Please fill in all fields.');
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/register',
        {
          username,
          email,
          password,
          name,
          surname,
          telephone_number,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Save user data to localStorage
      const userData = {
        username,
        email,
        name,
        surname,
        telephone_number,
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log("userData", userData);
      setModalMessage('Registration successful!');
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error.response || error);
      const errorMessage =
        error.response?.data?.message || 'An error occurred during registration.';
      setModalMessage(errorMessage);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    if (modalMessage === 'Please fill in all fields.') {
      setShowModal(false); // Po kliknięciu Close tylko zamykamy modal
    } else {
      setShowModal(false);
      localStorage.setItem('test', 222);
      navigate('/login'); // Jeśli formularz został poprawnie wysłany, przekierowanie do loginu
    }
  };

  return (
    <div>
      <h2 className="register-header"> Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-input"
        />
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="register-input"
        />
        <input
          type="text"
          placeholder="Phone number"
          value={telephone_number}
          onChange={(e) => setTelephoneNumber(e.target.value)}
          className="register-input"
        />
        <button type="submit" className="register-button" id="register-submit">Register</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal} className="modal-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
