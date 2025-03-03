const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password:  {type: String, required: true},
    email:  {type: String, required: true, unique: true},
    bio: {type: String},
    profile:{
        profilePicture: {type: String},
        active: {type: Boolean}
    },
    friends: [ 
        { userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        createdAt: { type: Date, default: Date.now },
    }
   ],
   friendRequests: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'accepted', 'declined', 'blocked'], default: 'pending' },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  notifications: [{
    type: { type: String, enum: ['friend_request', 'like', 'comment', 'friend_request_accepted'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },        relatedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, 
    postDescription: {type: String},
    comment: {type: String},
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

}]
})

const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: '7d'})
    return token
}

const User = mongoose.model('User', userSchema)

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required().label('First name'),
        lastName: Joi.string().min(2).max(50).required().label('Last name'),
       email: Joi.string().required().label('Email'),
       password: passwordComplexity(complexityOptions).label('Password'),
       profile: Joi.object({
        profilePicture: Joi.string().uri().label('Profile Picture'), 
        active: Joi.boolean().label('Active')
    }).label('Profile')
    })

    return schema.validate(data)
}

module.exports = {User, validate, complexityOptions}
