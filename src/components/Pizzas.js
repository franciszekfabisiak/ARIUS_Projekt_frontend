import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pizzas.css';

function Pizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pizzas');
        setPizzas(response.data);

        const pizzaMap = {};
        response.data.forEach((pizza) => {
          pizzaMap[pizza.name] = {
            id: pizza.id,
            price: pizza.price,
            image_url: pizza.image_url,
          };
        });
        console.log(response.data[0].name);
        localStorage.setItem('pizzaMap', JSON.stringify(pizzaMap));
      } catch (error) {
        setError('Error fetching pizzas. Please try again later.');
      }
    };
    fetchPizzas();
  }, []);

  const handlePizzaClick = (pizza) => {
    if (!userId) {
      alert('You need to log in to add pizzas to the cart!');
    } else {
      setSelectedPizza(pizza);
      setShowModal(true);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(selectedPizza.name);
    localStorage.setItem('cart', JSON.stringify(cart));
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="pizzas-container">
      <h2 className="pizzas-header">Available Pizzas</h2>
      {error && <p className="pizzas-error">{error}</p>}
      
      {pizzas.length > 0 ? (
        <div className="pizzas-grid">
          {pizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="pizza-card"
              onClick={() => handlePizzaClick(pizza)}
            >
              <img
                src={pizza.image_url}
                alt={pizza.name}
                className="pizza-image"
              />
              <div className="pizza-content">
                <h3 className="pizza-name">{pizza.name}</h3>
                <p className="pizza-details">{pizza.details}</p>
                <p className="pizza-price">${pizza.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="pizzas-empty">No pizzas available at the moment.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">
              Do you want to add <strong>{selectedPizza.name}</strong> to the cart?
            </p>
            <div className="modal-buttons">
              <button 
                className="modal-button modal-button-confirm"
                onClick={handleAddToCart}
              >
                Yes
              </button>
              <button 
                className="modal-button modal-button-cancel"
                onClick={handleCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pizzas;
