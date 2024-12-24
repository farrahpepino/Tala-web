const { User } = require('../../models/userModel'); 

const updateProfile = async (req, res) => {
  
    console.log(req.params)
    console.log(req.body)
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body }, 
      { new: true } 
    );

    if (!updatedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated:', updatedUser);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = updateProfile;
