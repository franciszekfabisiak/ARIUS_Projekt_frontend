import React, { useState, useEffect } from 'react';

function Account() {
  const [userData, setUserData] = useState(null); // User data state
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [editedData, setEditedData] = useState({}); // Temporarily store edited data

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Handle field changes in edit mode
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes to localStorage
  const handleSave = () => {
    const updatedData = { ...userData, ...editedData };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setUserData(updatedData);
    setEditMode(false);
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
        <p>No user data found in local storage. Please register first.</p>
      )}
    </div>
  );
}

export default Account;
