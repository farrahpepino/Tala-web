const mongoose = require('mongoose');
const User = require('./userModel')

const chatSchema = new mongoose.Schema(
{

    participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      ],
      messages: [
        {
          sender: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
          },
          content: { 
            type: String, 
            required: true 
          },
          sentAt: { 
            type: Date, 
            default: Date.now 
          }
        }
      ]
},
{timestamps: true})


chatSchema.pre('save', (next)=>{
if(this.participants<2){
    return next(new Error('A chat must have at least two participants.'));    return next(new Error('A chat must have at least two participants.'));
}
next();
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
