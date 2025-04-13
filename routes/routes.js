const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');
// ------------------ Home Route ------------------
router.get('/', (req, res) => {
  logger.info(`Visited homepage by ${req.session.user?.username }`);
  res.render('welcome', { user: req.session.user || null });
  
});
// ------------------ Search (Safe) ------------------
router.get('/search', (req, res) => {
  const query = `%${req.query.query || ''}%`;
  const sql = `SELECT * FROM blog_posts WHERE title LIKE ? OR content LIKE ?`;

  db.all(sql, [query, query], (err, rows) => {
    if (err){ 
      logger.error(`Search failed: ${err.message}`);
      return res.status(500).send('Search failed');
    }
    logger.info(`User Searched : "${req.query.query}"`);
    res.render('search_results', { posts: rows, searchTerm: req.query.query });
  });
});

// ------------------ Create Blog Post ------------------
router.get('/create', (req, res) => {
  if (!req.session.user){
     return res.redirect('/login');
  }
  res.render('create');
});

router.post('/create', [
  body('title').notEmpty().trim().escape(),
  body('content').notEmpty().trim()
], (req, res) => {
  if (!req.session.user){ 
    return res.status(403).send('Login required');
  }
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
});

// ------------------ View All Posts ------------------
router.get('/posts', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  const sql = `
    SELECT blog_posts.*, users.username
    FROM blog_posts
    JOIN users ON blog_posts.user_id = users.id
  `;
  db.all(sql, [], (err, posts) => {
    if (err) {
      return res.status(500).send('Database error.');
    }
    res.render('all_posts', { posts, user: req.session.user });
  });
});


// ----------------------- Edit Post (Users and Admins) ------------------
router.get('/edit/:id', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(403).send('Login required');
  }
  const postId = parseInt(req.params.id, 10);
  const query = `SELECT * FROM blog_posts WHERE id = ?`;

  db.get(query, [postId], (err, post) => {
    if (err || !post){
       return res.status(404).send('Post not found');
    }
    // Allow only owner or admin
    if (user.id !== post.user_id && !user.is_admin) {
      return res.status(403).send('Not authorized to edit');
    }

    res.render('edit', { post });
  });
});

router.post('/edit/:id', [
  body('title').notEmpty().trim().escape(),
  body('content').notEmpty().trim()
], (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(403).send('Login required');
  }
  const postId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  const query = `UPDATE blog_posts SET title = ?, content = ? WHERE id = ?`;

  db.run(query, [title, content], function (err) {
    if (err){
      logger.error(`Failed to update post titel ${title} by ${user.username}: ${err.message}`);
       return res.status(500).send('Error updating post');
    }
       logger.info(`Post title ${title} updated by ${user.username}`);
       res.redirect('/posts');
  });
});

module.exports = router;
