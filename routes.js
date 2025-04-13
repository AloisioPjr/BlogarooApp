// routes.js
const express = require('express');
const router = express.Router();
const db = require('./models/db');

// Root route (homepage)
router.get('/', (req, res) => {

  if (req.session.user) {
    res.render('welcome', { user: req.session.user });
  } else {
    res.render('welcome', { user: null });
  }
});

// Insecure registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// Insecure registration handler
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  //  SQL Injection-prone query
  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

  db.run(query, function (err) {
    if (err) {
      console.error(' Registration error:', err.message);
      return res.send('Something went wrong!');
    }
    res.redirect('/login');
  });
});


// ------------------- Login form 
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login ( insecure)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Insecure SQL query (vulnerable to SQL injection)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.get(query, (err, user) => {
    if (err) {
      console.error(' Login error:', err.message);
      return res.send('Something went wrong!');
    }

    if (user) {
      req.session.user = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin === 1
      };
      res.redirect('/');
    } else {
      res.send('Invalid username or password!');
    }
  });
});

//----------
// Route to display blog creation form
router.get('/create', (req, res) => {
  res.render('create');
});

// Insecure blog post creation
router.post('/create', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user ? req.session.user.id : null;

  const sql = `INSERT INTO blog_posts (title, content, user_id) VALUES (?, ?, ?)`;
  db.run(sql, [title, content, userId], (err) => {
    if (err) {
      console.error(err);
      res.send('Error creating post');
    } else {
      res.redirect('/posts');
    }
  });
});

// View all posts
router.get('/posts', (req, res) => {
  const sql = 'SELECT * FROM blog_posts';
  db.all(`
    SELECT blog_posts.*, users.username 
    FROM blog_posts 
    JOIN users ON blog_posts.user_id = users.id
  `, [], (err, posts) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error.");
    }
    res.render('all_posts', { posts });
  });

});


// Search posts (insecure)
// This is an example of an insecure search implementation that is vulnerable to SQL injection.
router.get('/search', (req, res) => {
  const query = req.query.query;

  // TEMP: If query contains script tag, bypass the DB query to demonstrate XSS
  if (query && query.includes('<script>')) {
    return res.render('search_results', { posts: [], searchTerm: query });
  }

  const sql = `SELECT * FROM blog_posts WHERE title LIKE '%${query}%' OR content LIKE '%${query}%'`;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.send('Error occurred');
    } else {
      res.render('search_results', { posts: rows, searchTerm: query });
    }
  });
});


// routes.js
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Delete a blog post (only for admins)
router.post('/delete/:id', (req, res) => {
  const user = req.session.user;

  if (!user || !user.is_admin) {
    return res.status(403).send('Forbidden: Only admins can delete posts.');
  }

  const postId = req.params.id;
  const query = `DELETE FROM blog_posts WHERE id = ${postId}`;

  db.run(query, function (err) {
    if (err) {
      console.error('Delete error:', err.message);
      return res.send('Error deleting post.');
    }
    res.redirect('/posts');
  });
});
// Render edit form (only for the original author or admin)
router.get('/edit/:id', (req, res) => {
  const user = req.session.user;
  const postId = req.params.id;

  const query = `SELECT * FROM blog_posts WHERE id = ${postId}`;
  db.get(query, (err, post) => {
    if (err || !post) {
      return res.send('Post not found.');
    }

    if (!user || (user.id !== post.user_id && !user.is_admin)) {
      return res.status(403).send('Forbidden: You cannot edit this post.');
    }

    res.render('edit', { post });
  });
});
// Handle post update
router.post('/edit/:id', (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;

  const updateQuery = `UPDATE blog_posts SET title = '${title}', content = '${content}' WHERE id = ${postId}`;

  db.run(updateQuery, function (err) {
    if (err) {
      console.error('Update error:', err.message);
      return res.send('Error updating post.');
    }

    res.redirect('/posts');
  });
});

module.exports = router;
