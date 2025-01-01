import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Order({ userId }) {
  const [pizzas, setPizzas] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchPizzasAndToppings = async () => {
      const pizzasResponse = await axios.get('http://localhost:5000/pizzas');
      const toppingsResponse = await axios.get('http://localhost:5000/toppings');
      setPizzas(pizzasResponse.data);
      setToppings(toppingsResponse.data);
    };
    fetchPizzasAndToppings();
  }, []);

  const handleAddItem = (pizzaId) => {
    setSelectedItems([...selectedItems, { pizza_id: pizzaId, topping_ids: [] }]);
  };

  const handleSubmit = async () => {
    const orderData = { user_id: userId, items: selectedItems };
    try {
      const response = await axios.post('http://localhost:5000/order', orderData);
      alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
    } catch (error) {
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Order Pizza</h2>
      <div>
        <h3>Select Pizzas</h3>
        {pizzas.map((pizza) => (
          <button key={pizza.id} onClick={() => handleAddItem(pizza.id)}>
            {pizza.name} - ${pizza.price}
          </button>
        ))}
      </div>

      <div>
        <h3>Select Toppings</h3>
        {toppings.map((topping) => (
          <label key={topping.id}>
            <input type="checkbox" />
            {topping.name} - ${topping.price}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit}>Place Order</button>
    </div>
  );
}

export default Order;