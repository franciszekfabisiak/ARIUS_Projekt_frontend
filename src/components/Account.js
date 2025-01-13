import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';

function Account() {
  const [userData, setUserData] = useState(null); // User data state
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [editedData, setEditedData] = useState({}); // Temporarily store edited data
  const [orders, setOrders] = useState([]); // Orders state

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    const storedUserData = localStorage.getItem('userData');

    if (userId && storedUserData) {
      setUserData(JSON.parse(storedUserData));

      // Fetch orders for the user from the backend
      axios
        .get(`http://localhost:5000/orders/${userId}`)
        .then((response) => {
          setOrders(response.data); // Set orders in the state
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    } else {
      console.error("User data or userId not found in localStorage.");
    }
  }, []);

  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID is missing in localStorage.");
      return;
    }

    const updatedData = { ...userData, ...editedData };
    localStorage.setItem('userData', JSON.stringify(updatedData)); // Save updated data to localStorage
    setUserData(updatedData);

    try {
      await axios.put(`http://localhost:5000/update_user/${userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("User data successfully updated on the server.");
    } catch (error) {
      console.error("Error updating user data on the server:", error);
    }

    setEditMode(false);
  };

  return (
    <div className="account-container">
      <h2>Account Details</h2>
      {userData ? (
        <div>
          {!editMode ? (
            <div className="account-details">
              <p>Username: {userData?.username || 'N/A'}</p>
              <p>Email: {userData?.email || 'N/A'}</p>
              <p>Name: {userData?.name || 'N/A'}</p>
              <p>Surname: {userData?.surname || 'N/A'}</p>
              <p>Telephone: {userData?.telephone_number || 'N/A'}</p>
              <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
            </div>
          ) : (
            <div className="edit-form">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  defaultValue={userData.username}
                  onChange={handleChange}
                  disabled // Username should not be editable
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  defaultValue={userData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  defaultValue={userData.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Surname:
                <input
                  type="text"
                  name="surname"
                  defaultValue={userData.surname}
                  onChange={handleChange}
                />
              </label>
              <label>
                Telephone:
                <input
                  type="text"
                  name="telephone_number"
                  defaultValue={userData.telephone_number}
                  onChange={handleChange}
                />
              </label>
              <button className="save-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          )}

          {/* My Orders Section */}
          <div className="orders-section">
            <h3>My Orders</h3>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul className="orders-list">
                {orders.map((order) => (
                  <li key={order.order_id} className="order-item">
                    <h4>Order ID: {order.order_id}</h4>
                    <p>Created at: {order.created_at}</p>
                    <p>Delivery time: {order.delivery_time}</p>
                    <p>Location: {order.location}</p>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          <strong>{item.pizza}</strong> - Toppings: {item.toppings.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p>No user data found in local storage. Please log in first.</p>
      )}
    </div>
  );
}

export default Account;
