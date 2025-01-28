// const mongoose = require('mongoose');


// const friendsSchema = new mongoose.Schema({
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     status: {
//         type: String,
//         enum: ['pending', 'accepted', 'declined'],
//         default: 'pending',
//     },
//     createdAt: { type: Date, default: Date.now },
//     statusUpdatedAt:{type: Date, default:null},

// });

// friendsSchema.methods.updateStatus = function(newStatus){
//     this.status = newStatus;
//     this.statusUpdatedAt = Date.now();
//     return this.save();
// }

// module.exports = mongoose.model('Friends', friendsSchema);