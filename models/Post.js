const mongoose = require('mongoose');

// Define the comment schema
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true }, // The comment text
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the user who made the comment
});

// Define the post schema
const postSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the post
    content: { type: String, required: true }, // Content of the post
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
    user_like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who liked the post
    comments: [commentSchema], // List of comments (text + idUser)
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
