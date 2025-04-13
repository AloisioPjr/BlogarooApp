// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');
// GET Register Page
router.get('/register', (req, res) => {
  logger.info('Register page accessed by visitor');
  res.render('register');
});

// POST Register User
router.post('/register', [
  body('username')
    .isLength({ min: 6 }).withMessage('Username must be at least 6 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be alphanumeric with underscores only'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password Must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[\W_]/).withMessage('Password must contain a special character')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Registration validation failed for user "${req.body.username}"`);
    return res.render('register', { errors: errors.array() });
  }

  const { username, password } = req.body;

  //  Check if username already exists
  const existingUserQuery = `SELECT * FROM users WHERE username = ?`;
  db.get(existingUserQuery, [username], async (err, user) => {
    if (err) {
      logger.error(`Database error checking existing user "${username}": ${err.message}`);
      return res.status(500).send('Server error');
    }

    if (user) {
      logger.warn(`Tried to register with existing username: ${username}`);
      // Username taken, send message to UI
      return res.render('register', {
        errors: [{ msg: 'Username already exists. Please choose another.' }]
      });
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user safely
    const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(insertQuery, [username, hashedPassword], function (err) {
      if (err) {
        logger.error(`Error inserting new user "${username}": ${err.message}`);
        return res.status(500).send('Registration error');
      }
      logger.info(`New user registered: ${username}`);
      res.redirect('/login');
    });
  });
});


// GET Login Page
router.get('/login', (req, res) => {
  logger.info('Login page accessed by visitor');
  res.render('login');
});

// POST Login
router.post('/login', [
  body('username').notEmpty(),
  body('password').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){ return res.status(400).send('Invalid input');
  }

  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;

  db.get(query, [username], async (err, user) => {
    if (err) {
      logger.error(`Database error during login for user "${username}": ${err.message}`);
      return res.status(500).send('Login error');
    }
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin === 1

      };
    
      logger.info(`User logged in: ${username}`);
      res.redirect('/');
    } else {
      logger.warn(`Failed login attempt for username: ${username}`);
      res.status(401).send('Invalid credentials');

    }
  });
});

// GET Logout
router.get('/logout', (req, res) => {
  const username = req.session?.user?.username || 'Unknown user'; // default to 'Unknown user' if not logged in
  req.session.destroy(err => {// destroy the session and remove it from the cookie store
    if (err) {
      logger.error(`Logout failed for user: ${username}`);
      return res.redirect('/');

    }
    
    res.clearCookie('connect.sid');
    logger.info(`User logged out: ${username}`);
    res.redirect('/login');
  });
});

module.exports = router;
