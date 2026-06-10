const User = require('../model/user.model');

exports.addUserAddress = async (req, res) => {
  const { userId, address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add address to the user's address array
    user.address.push(address);
    await user.save();
    
    res.status(200).json({ message: 'Address added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

// Get user profile data
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('name email profilePhoto address');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};
