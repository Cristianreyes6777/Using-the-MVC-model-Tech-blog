const db = require('../models');

// Display all blog posts on the homepage
exports.displayHomepage = async (req, res) => {
  try {
    const allPosts = await db.Post.findAll();
    res.render('homepage', { allPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Display a specific blog post
exports.displayPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await db.Post.findByPk(postId, { include: db.Comment });
    res.render('post', { post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
