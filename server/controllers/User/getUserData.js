const mongoose = require('mongoose'); 
const { User } = require('../../models/userModel');

const getUserData = async (req, res) => {
  const { userId } = req.params;

  console.log('Received userId:', userId);

  if (!userId) {
    return res.status(400).send({ message: 'No userId provided.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Invalid userId format.' });
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userData = await User.findOne({ _id: userObjectId }).lean();

    if (!userData) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = getUserData;
