const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content, idUser } = req.body;
        const newPost = new Post({ title, content, idUser });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('idUser', 'username').populate('comments.idUser', 'username');// Populate user info
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('idUser', 'username').populate('comments.idUser', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(req.params.id);
        const { userId } = req.body; // Assume user ID is passed in the request body userId

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.user_like.includes(userId)) {
            post.user_like.push(userId);
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(400).json({ message: 'User already liked the post' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const { text, idUser } = req.body;

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = { text, idUser };
        post.comments.push(newComment);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment from a post
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


};

// Edit a comment of a post
exports.editComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Find the comment by its ID
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Update the comment text
        comment.text = req.body.text || comment.text;
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
