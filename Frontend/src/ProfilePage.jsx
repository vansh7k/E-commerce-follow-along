import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';


const ProfilePage = () => {
  const { userId } = useContext(UserContext); // Assuming userId is available in context
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/user/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const history = useHistory(); // Initialize useHistory

  const handleAddAddress = () => {
    history.push('/address-form'); // Navigate to AddressForm
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <img src={user.profilePhoto} alt="Profile" />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
      <div>
        <h3>Address</h3>
        {user.address ? (
          <p>{user.address}</p>
        ) : (
          <p>No address found</p>
        )}
        <button onClick={handleAddAddress}>Add Address</button>
      </div>
    </div>
  );
};

export default ProfilePage;
