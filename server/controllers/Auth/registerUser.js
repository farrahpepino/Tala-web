const { User, validate } = require('../../models/userModel');
const bcrypt = require('bcrypt');

exports.registerUser = async(req, res) => {

    try{
        const {error} = validate(req.body)

        if(error)
            return res.status(400).send({message: error.details[0].message})

        const user = await User.findOne({email: req.body.email});
        if (user)
            return res.status(409).send({message: 'Account with given email already exists'})
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({ ...req.body, password: hashPassword });
        await newUser.save();

        const token = newUser.generateAuthToken();
        res.status(201).send({
            message: 'Account created successfully',
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                userId: newUser._id
            },
            token
        });
    }
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Internal Server Error'})
    }
}