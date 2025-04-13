// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const logger = require('../utils/logger');
// ------------------ Delete Post (Admins Only ) ------------------
router.post('/delete/:id', (req, res) => {
  const user = req.session.user;
  if (!user || !user.is_admin) {
    return res.status(403).send('Admins only'); // Check if the current user is an admin
  }
  const postId = parseInt(req.params.id, 10);// Parse post ID from URL
  const query = `DELETE FROM blog_posts WHERE id = ?`;// SQL query to delete post

  db.run(query, [postId], function (err) {
    if (err){
// Log error and send response
      logger.error(`Failed to delete post ID ${postId}: ${err.message}`); 
      return res.status(500).send('Error deleting post');
    }
    logger.info(`Post ID ${postId} delete by ${user.username}`); // Log if deletion is successful
    res.redirect('/posts');
  });
});

module.exports = router;
