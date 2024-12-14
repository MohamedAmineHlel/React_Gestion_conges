const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Adjust path as necessary

// Create a new post
router.post('/', postController.createPost);

// Get all posts
router.get('/', postController.getPosts);

// Get a single post by ID
router.get('/:id', postController.getPostById);

// Update a post by ID
router.put('/:id', postController.updatePost);

// Delete a post by ID
router.delete('/:id', postController.deletePost);

// Like a post
router.post('/:id/like', postController.likePost);

// Add a comment to a post
router.post('/:id/comment', postController.addComment);

// Delete a comment from a post
router.delete('/:id/comment/:commentId', postController.deleteComment);
// Edit a comment in a post
router.put('/:id/comment/:commentId', postController.editComment);

module.exports = router;
