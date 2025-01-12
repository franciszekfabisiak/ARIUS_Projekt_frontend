import React, { useState, useEffect } from 'react';
import { FixedSizeList } from "react-window";
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [pizzaDetails, setPizzaDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPizza, setCurrentPizza] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(""); // State for delivery date
  const [deliveryTime, setDeliveryTime] = useState(""); // State for delivery time
  const [deliveryAddress, setDeliveryAddress] = useState(""); // State for delivery address

  // Load cart and pizza details
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);

    const pizzaMap = JSON.parse(localStorage.getItem('pizzaMap')) || {};
    const details = savedCart.map((pizzaName) => ({
      name: pizzaName,
      ...pizzaMap[pizzaName],
      topping_ids: [],
    }));
    setPizzaDetails(details);
  }, []);

  // Fetch toppings from the backend
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/toppings');
        setToppings(response.data);
      } catch (error) {
        console.error('Error fetching toppings:', error);
      }
    };
    fetchToppings();
  }, []);

  const handleRemove = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    const updatedDetails = [...pizzaDetails];
    updatedDetails.splice(index, 1);
    setPizzaDetails(updatedDetails);
  };

  const handleAdditionalTopping = (pizzaIndex) => {
    setCurrentPizza(pizzaIndex);
    setSelectedToppings(pizzaDetails[pizzaIndex].topping_ids || []);
    setShowModal(true);
  };

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleSaveToppings = () => {
    const updatedDetails = [...pizzaDetails];
    updatedDetails[currentPizza].topping_ids = selectedToppings;
    setPizzaDetails(updatedDetails);
    setShowModal(false);
  };

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }

    if (!deliveryDate || !deliveryTime || !deliveryAddress) {
      alert("Please complete all fields: delivery date, time, and address.");
      return;
    }

    // Combine date and time into a single timestamp
    const combinedDateTime = `${deliveryDate} ${deliveryTime}:00`; // Add seconds for format compatibility

    const order = {
      user_id: userId,
      items: pizzaDetails.map((pizza) => ({
        pizza_id: pizza.id, // Ensure each pizza has an `id`
        topping_ids: pizza.topping_ids || [],
      })),
      delivery_time: combinedDateTime,
      location: deliveryAddress,
    };
    console.log("userId", userId);
    try {
      const response = await axios.post('http://localhost:5000/order', order);
  
      if (response.status === 201) {
        // Save order_id to localStorage
        localStorage.setItem('order_id', response.data.order_id);
        console.log("userId", userId);
        // Alert and reset form state
        alert("Order placed successfully!");
        setCartItems([]);
        setPizzaDetails([]);
        setDeliveryDate("");
        setDeliveryTime("");
        setDeliveryAddress("");
        console.log('userId przed', localStorage.getItem('userId'));
        localStorage.removeItem('cart');
        console.log('userId po', localStorage.getItem('userId'));
        // Redirect to the rate page
        window.location.href = "/rate"; // Redirect using window.location
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const renderRow = ({ index, style }) => {
    const pizza = pizzaDetails[index];
    if (!pizza) return null;

    return (
      <div style={style} key={index}>
        <img src={pizza.image_url} alt={pizza.name} style={{ width: '50px', height: '50px' }} />
        <span>{pizza.name}</span>
        <span>${pizza.price.toFixed(2)}</span>
        <button onClick={() => handleRemove(index)}>Remove</button>
        <button onClick={() => handleAdditionalTopping(index)}>Additional Topping</button>
      </div>
    );
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <FixedSizeList
            height={400}
            itemCount={cartItems.length}
            itemSize={70}
            width="100%"
          >
            {renderRow}
          </FixedSizeList>

          {/* Delivery Address Input */}
          <div style={{ marginTop: '20px' }}>
            <label>
              Delivery Address:
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  width: '300px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              />
            </label>
          </div>

          {/* Delivery Date and Time Input */}
          <div style={{ marginTop: '10px' }}>
            <label>
              Delivery Date:
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              />
            </label>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>
              Delivery Time (HH:mm):
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              />
            </label>
          </div>

          <button
            onClick={handlePlaceOrder}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Place Order
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <h3>Select Toppings</h3>
            {toppings.map((topping) => (
              <div key={topping.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={selectedToppings.includes(topping.id)}
                  onChange={() => handleToppingChange(topping.id)}
                />
                <span style={{ marginLeft: '10px' }}>{topping.name} (${topping.price.toFixed(2)})</span>
              </div>
            ))}
            <button onClick={handleSaveToppings} style={modalStyles.button}>Save</button>
            <button onClick={() => setShowModal(false)} style={modalStyles.button}>Cancel</button>
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
    margin: '10px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default Cart;
