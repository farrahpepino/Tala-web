const mongoose = require('mongoose');
const User = require('./userModel'); 

const postSchema = new mongoose.Schema({
    likes: [
        {
            likedBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            likedAt: { 
                type: Date, 
                default: Date.now 
            },
            
        }
    ],
    comments: [
        {
            commentBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            content: { 
                type: String, 
                required: true 
            },
            commentedAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    postImages: [{ type: String }],
    description: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
}, {
    timestamps: true,
});

postSchema.pre('save', function (next) {
    if (!this.description && this.postImages.length === 0) {
        const err = new Error("Post must have either a description or at least one image.");
        return next(err);
    }
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
