import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Pizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pizzas');
        setPizzas(response.data); // Set the pizzas state with the response data
      } catch (error) {
        setError("Error fetching pizzas. Please try again later."); // Set the error state
        console.error("Error fetching pizzas:", error);
      }
    };
    fetchPizzas();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Available Pizzas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
      {pizzas.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {pizzas.map((pizza) => (
            <div 
              key={pizza.id} 
              style={{ 
                border: '1px solid #ccc', 
                borderRadius: '10px', 
                padding: '10px', 
                width: '250px', 
                textAlign: 'left' 
              }}
            >
              <img 
                src={pizza.image_url} 
                alt={pizza.name} 
                style={{ 
                  width: '100%', 
                  borderRadius: '10px 10px 0 0' 
                }} 
              />
              <h3>{pizza.name}</h3>
              <p>{pizza.details}</p>
              <p><strong>Price:</strong> ${pizza.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No pizzas available at the moment.</p> // Display message if there are no pizzas
      )}
    </div>
  );
}

export default Pizzas;