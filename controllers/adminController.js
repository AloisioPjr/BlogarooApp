const db = require('../models/db');
const logger = require('../utils/logger');

exports.deletePost = (req, res) => {
  const user = req.session.user;
  const postId = parseInt(req.params.id, 10);
  if (!user || !user.is_admin) return res.status(403).send('Admins only');
  const sql = `DELETE FROM blog_posts WHERE id = ?`;
  db.run(sql, [postId], function (err) {
    if (err) {
      logger.error(`Failed to delete post ID ${postId}: ${err.message}`);
      return res.status(500).send('Error deleting post');
    }
    logger.info(`Post ID ${postId} deleted by ${user.username}`);
    res.redirect('/posts');
  });
};
