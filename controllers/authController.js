const db = require('../models/db');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

exports.showRegister = (req, res) => res.render('register');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  const existingUserQuery = `SELECT * FROM users WHERE username = ?`;
  db.get(existingUserQuery, [username], async (err, user) => {
    if (err) return res.status(500).send('Server error');
    if (user) return res.render('register', {
      errors: [{ msg: 'Username already exists. Please choose another.' }]
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(insertQuery, [username, hashedPassword], (err) => {
      if (err) return res.status(500).send('Registration error');
      logger.info(`New user registered: ${username}`);
      res.redirect('/login');
    });
  });
};

exports.showLogin = (req, res) => res.render('login');

exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], async (err, user) => {
    if (err) return res.status(500).send('Login error');
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin === 1
      };
      logger.info(`User logged in: ${username}`);
      return res.redirect('/');
    }
    res.status(401).send('Invalid credentials');
  });
};

exports.logoutUser = (req, res) => {
  const username = req.session?.user?.username || 'Unknown user';
  req.session.destroy(err => {
    if (err) return res.redirect('/');
    res.clearCookie('connect.sid');
    logger.info(`User logged out: ${username}`);
    res.redirect('/login');
  });
};
