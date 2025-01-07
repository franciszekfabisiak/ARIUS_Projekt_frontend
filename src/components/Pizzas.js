import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Pizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedPizza, setSelectedPizza] = useState(null); // Selected pizza

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pizzas');
        setPizzas(response.data);
      } catch (error) {
        setError('Error fetching pizzas. Please try again later.');
      }
    };
    fetchPizzas();
  }, []);

  const handlePizzaClick = (pizza) => {
    if (!userId) {
      // alert(userId)
      alert('You need to log in to add pizzas to the cart!');
    } else {
      setSelectedPizza(pizza);
      setShowModal(true);
    }
  };

  const handleAddToCart = () => {
    console.log(`Pizza added to cart: ${selectedPizza.name}`);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };


  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Available Pizzas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pizzas.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {pizzas.map((pizza) => (
            <div
              key={pizza.id}
              onClick={() => handlePizzaClick(pizza)} // Handle click on pizza
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px',
                width: '250px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <img
                src={pizza.image_url}
                alt={pizza.name}
                style={{
                  width: '100%',
                  borderRadius: '10px 10px 0 0',
                }}
              />
              <h3>{pizza.name}</h3>
              <p>{pizza.details}</p>
              <p>
                <strong>Price:</strong> ${pizza.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No pizzas available at the moment.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <p>Do you want to add <strong>{selectedPizza.name}</strong> to the cart?</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleAddToCart} style={modalStyles.button}>
                Yes
              </button>
              <button onClick={handleCancel} style={modalStyles.button}>
                No
              </button>
            </div>
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
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #ccc',
    background: '#f0f0f0',
  },
};

export default Pizzas;
