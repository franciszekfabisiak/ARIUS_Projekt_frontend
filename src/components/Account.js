import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Account() {
  const [userData, setUserData] = useState(null); // User data state
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [editedData, setEditedData] = useState({}); // Temporarily store edited data

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user'); // Adjust the endpoint as needed
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handle field changes in edit mode
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes to backend
  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/user', editedData); // Adjust the endpoint as needed
      setUserData((prev) => ({ ...prev, ...editedData }));
      setEditMode(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Render the component
  return (
    <div>
      <h2>Account Details</h2>
      {userData ? (
        <div>
          {!editMode ? (
            <>
                <p>Username: {userData?.username || 'N/A'}</p>
                <p>Email: {userData?.email || 'N/A'}</p>
                <p>Name: {userData?.name || 'N/A'}</p>
                <p>Surname: {userData?.surname || 'N/A'}</p>
                <p>Telephone: {userData?.telephone_number || 'N/A'}</p>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          ) : (
            <>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  defaultValue={userData.username}
                  onChange={handleChange}
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
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Account;
