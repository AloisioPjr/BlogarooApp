const db = require('../models/db');
const logger = require('../utils/logger');

exports.showHome = (req, res) => {
  logger.info(`Visited homepage by ${req.session.user?.username}`);
  res.render('welcome', { user: req.session.user || null });
};

exports.searchPosts = (req, res) => {
  const query = `%${req.query.query || ''}%`;
  const sql = `SELECT * FROM blog_posts WHERE title LIKE ? OR content LIKE ?`;
  db.all(sql, [query, query], (err, rows) => {
    if (err) {
      logger.error(`Search failed: ${err.message}`);
      return res.status(500).send('Search failed');
    }
    logger.info(`User Searched : "${req.query.query}"`);
    res.render('search_results', { posts: rows, searchTerm: req.query.query });
  });
};

exports.showCreateForm = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('create');
};

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;
  const sql = `INSERT INTO blog_posts (title, content, user_id) VALUES (?, ?, ?)`;
  db.run(sql, [title, content, userId], (err) => {
    if (err) {
      logger.error(`Error creating post by user ${req.session.user.username}: ${err.message}`);
      return res.status(500).send('Error creating post');
    }
    logger.info(`Post created by ${req.session.user.username}: "${title}"`);
    res.redirect('/posts');
  });
};

exports.viewAllPosts = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const sql = `SELECT blog_posts.*, users.username FROM blog_posts JOIN users ON blog_posts.user_id = users.id`;
  db.all(sql, [], (err, posts) => {
    if (err) return res.status(500).send('Database error.');
    res.render('all_posts', { posts, user: req.session.user });
  });
};

exports.showEditForm = (req, res) => {
  const user = req.session.user;
  const postId = parseInt(req.params.id, 10);
  const sql = `SELECT * FROM blog_posts WHERE id = ?`;
  db.get(sql, [postId], (err, post) => {
    if (err || !post) return res.status(404).send('Post not found');
    if (user.id !== post.user_id && !user.is_admin) return res.status(403).send('Not authorized to edit');
    res.render('edit', { post });
  });
};

exports.updatePost = (req, res) => {
  const user = req.session.user;
  const postId = parseInt(req.params.id, 10);
  const { title, content } = req.body;
  const sql = `UPDATE blog_posts SET title = ?, content = ? WHERE id = ?`;
  db.run(sql, [title, content, postId], function (err) {
    if (err) {
      logger.error(`Failed to update post title ${title} by ${user.username}: ${err.message}`);
      return res.status(500).send('Error updating post');
    }
    logger.info(`Post title ${title} updated by ${user.username}`);
    res.redirect('/posts');
  });
};
