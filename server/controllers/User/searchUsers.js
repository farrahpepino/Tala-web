const { User } = require('../../models/userModel'); 

const searchUsers = async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send({ message: 'Query is required' });
    }

    try {
        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } }
            ]
        });
        
        res.status(200).send(users);
        console.log(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = searchUsers;
