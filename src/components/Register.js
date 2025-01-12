import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone number"
          value={telephone_number}
          onChange={(e) => setTelephoneNumber(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal} style={modalStyles.button}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default Register;
