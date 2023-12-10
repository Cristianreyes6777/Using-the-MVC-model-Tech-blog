const db = require('../models');

// Display the user's blog posts on the dashboard
exports.displayDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have a User model with 'id' field
    const userPosts = await db.Post.findAll({ where: { UserId: userId } });
    res.render('dashboard', { userPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Render the page for creating a new blog post
exports.renderCreatePostPage = (req, res) => {
  res.render('create-post');
};

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming you have a User model with 'id' field
    await db.Post.create({ title, content, UserId: userId });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
