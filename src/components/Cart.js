import React, { useState, useEffect } from 'react';
import { FixedSizeList } from "react-window";
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [pizzaDetails, setPizzaDetails] = useState([]);

  // Load cart from localStorage on the first render
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // Fetch pizza details from the backend using axios
  const fetchPizzaDetails = async (pizzaName) => {
    try {
      const response = await axios.get(`http://localhost:5000/pizzas?name=${pizzaName}`);
      return response.data[0]; // Assuming the API returns an array of pizzas
    } catch (error) {
      console.error('Error fetching pizza details:', error);
      return null;
    }
  };

  // Load details for all pizzas in the cart
  useEffect(() => {
    const loadPizzaDetails = async () => {
      const details = [];
      for (let i = 0; i < cartItems.length; i++) {
        const pizza = await fetchPizzaDetails(cartItems[i]);
        if (pizza) {
          details.push(pizza);
        }
      }
      setPizzaDetails(details);
    };
    loadPizzaDetails();
  }, [cartItems]);

  // Function to remove a pizza from the cart
  const handleRemove = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1); // Remove pizza from cart
    setCartItems(updatedCart); // Update the state
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
  };

  // Function to render each row in the list
  const renderRow = ({ index, style }) => {
    const pizza = pizzaDetails[index];
    if (!pizza) return null; // Do not render if pizza is not loaded yet

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px',
          borderBottom: '1px solid #ccc',
        }}
        key={index}
      >
        {/* Pizza Image */}
        <img
          src={pizza.image_url} // Getting the full image URL
          alt={pizza.name}
          style={{ width: '50px', height: '50px', borderRadius: '8px' }}
        />

        {/* Pizza Name */}
        <span style={{ flex: 2, marginLeft: '10px' }}>{pizza.name}</span>

        {/* Pizza Price */}
        <span style={{ flex: 1, textAlign: 'center' }}>
          cost - ${pizza.price.toFixed(2)}
        </span>

        {/* Remove Button */}
        <button
          onClick={() => handleRemove(index)}
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <FixedSizeList
          height={400} // Height of the visible area of the list
          itemCount={cartItems.length} // Number of items in the cart
          itemSize={70} // Height of each item
          width="100%" // Width of the list
        >
          {renderRow}
        </FixedSizeList>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
