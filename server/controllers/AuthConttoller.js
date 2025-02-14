const { User, complexityOptions, validate } = require('../models/userModel');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

exports.loginUser = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Method Not Allowed' });
    }
    try {
        const { error } = validateLogin(req.body);
        if (error) 
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user) 
            return res.status(401).send({ message: 'Invalid Email or Password' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) 
            return res.status(401).send({ message: 'Invalid Email or Password' });

        const token = user.generateAuthToken();
        
        res.status(200).send({
            message: 'Logged in successfully',
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userId: user._id,
                bio: user.bio,
                profilePicture: user.profile.Picture,
                active: true,
            },
        });
        console.log('Logged in successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity(complexityOptions).required().label('Password'),
    });
    return schema.validate(data);
};



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