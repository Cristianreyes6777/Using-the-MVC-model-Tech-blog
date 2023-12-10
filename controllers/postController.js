const db = require('../models');

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming you have a User model with 'id' field
    const post = await db.Post.create({ title, content, UserId: userId });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blog posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await db.Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new comment on a blog post
exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id; // Assuming you have a User model with 'id' field
    const comment = await db.Comment.create({ text, PostId: postId, UserId: userId });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for a specific blog post
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await db.Comment.findAll({ where: { PostId: postId } });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
