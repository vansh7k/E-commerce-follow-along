import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext


import { useHistory } from 'react-router-dom';

import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext

import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext

const AddressForm = () => {
  const [address, setAddress] = useState('');
  const history = useHistory();
  const { userId } = useContext(UserContext); // Get userId from context

  const [address, setAddress] = useState('');
  const history = useHistory();
  const { userId } = useContext(UserContext); // Get userId from context

  const [address, setAddress] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId } = useContext(UserContext); // Get userId from context
    const { userId } = useContext(UserContext); // Get userId from context
    const { userId } = useContext(UserContext); // Get userId from context
    const response = await fetch(`http://localhost:7000/api/user/address`, {


      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, // Now userId is defined
        address,
      }),

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, // Now userId is defined
        address,
      }),


      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, // Assuming userId is available in context or passed as a prop
        address,
      }),
    });
    const result = await response.json();
    console.log(result.message); // Log success message

    console.log(result.message); // Log success message
    console.log(result.message); // Log success message
    console.log(result.message); // Log success message
    console.log(result.message); // Log success message
    console.log('Address submitted:', address);




    // Navigate back to profile page after submission
    history.push('/profile');

    history.push('/profile');

    history.push('/profile');

    history.push('/profile');

    history.push('/profile');
  };

  return (
    <div>
      <h1>Add Address</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddressForm;
