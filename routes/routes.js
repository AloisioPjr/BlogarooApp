// routes/routes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

// Home and Blog Post Routes
router.get('/', postController.showHome);
router.get('/search', postController.searchPosts);
router.get('/create', postController.showCreateForm);
router.post('/create', [
  body('title').notEmpty().trim().escape(),
  body('content').notEmpty().trim().escape()
], postController.createPost);
router.get('/posts', postController.viewAllPosts);
router.get('/edit/:id', postController.showEditForm);
router.post('/edit/:id', [
  body('title').notEmpty().trim().escape(),
  body('content').notEmpty().trim()
], postController.updatePost);

// Admin Route
router.post('/delete/:id', adminController.deletePost);

// Auth Routes
router.get('/register', authController.showRegister);
router.post('/register', [
  body('username')
    .isLength({ min: 6 }).withMessage('Username must be alphanumeric and at least 6 characters long')
    .matches(/^[a-zA-Z0-9_]+$/),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', { errors: errors.array() });
  }
  next();
}, authController.registerUser);

router.get('/login', authController.showLogin);
router.post('/login', [
  body('username').notEmpty(),
  body('password').notEmpty()
], authController.loginUser);

router.get('/logout', authController.logoutUser);

module.exports = router;
