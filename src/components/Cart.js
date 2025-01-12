import React, { useState, useEffect } from 'react';
import { FixedSizeList } from "react-window";
import axios from 'axios';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [pizzaDetails, setPizzaDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPizza, setCurrentPizza] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

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

    const combinedDateTime = `${deliveryDate} ${deliveryTime}:00`;

    const order = {
      user_id: userId,
      items: pizzaDetails.map((pizza) => ({
        pizza_id: pizza.id,
        topping_ids: pizza.topping_ids || [],
      })),
      delivery_time: combinedDateTime,
      location: deliveryAddress,
    };

    try {
      const response = await axios.post('http://localhost:5000/order', order);
  
      if (response.status === 201) {
        localStorage.setItem('order_id', response.data.order_id);
        alert("Order placed successfully!");
        setCartItems([]);
        setPizzaDetails([]);
        setDeliveryDate("");
        setDeliveryTime("");
        setDeliveryAddress("");
        localStorage.removeItem('cart');
        window.location.href = "/rate";
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
      <div style={{ ...style }} className="cart-item" key={index}>
        <img src={pizza.image_url} alt={pizza.name} />
        <span>{pizza.name}</span>
        <span>${pizza.price.toFixed(2)}</span>
        <button className="cart-button remove-button" onClick={() => handleRemove(index)}>
          Remove
        </button>
        <button className="cart-button topping-button" onClick={() => handleAdditionalTopping(index)}>
          Additional Topping
        </button>
      </div>
    );
  };

  return (
    <div className="cart-container">
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

          <div className="delivery-form">
            <div className="form-group">
              <label>Delivery Address:</label>
              <input
                type="text"
                className="form-input"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
              />
            </div>

            <div className="form-group">
              <label>Delivery Date:</label>
              <input
                type="date"
                className="form-input"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Delivery Time:</label>
              <input
                type="time"
                className="form-input"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>
          </div>

          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Toppings</h3>
            {toppings.map((topping) => (
              <div key={topping.id} className="topping-option">
                <input
                  type="checkbox"
                  className="topping-checkbox"
                  checked={selectedToppings.includes(topping.id)}
                  onChange={() => handleToppingChange(topping.id)}
                />
                <span className="topping-label">
                  {topping.name} (${topping.price.toFixed(2)})
                </span>
              </div>
            ))}
            <div className="modal-buttons">
              <button onClick={handleSaveToppings} className="modal-button save-button">
                Save
              </button>
              <button onClick={() => setShowModal(false)} className="modal-button cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;