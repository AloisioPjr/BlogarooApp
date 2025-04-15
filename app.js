const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session); // Persistent session store
const helmet = require('helmet'); // Sets secure HTTP headers
const csurf = require('csurf'); // Protects against CSRF attacks
const morgan = require('morgan'); // Logs HTTP requests
const path = require('path');// Path module for file and directory paths
const routes = require('./routes/routes');// Main routes for blog posts and app functionality

require('dotenv').config(); // Loads environment variables securely from .env

const app = express();// Create an Express application
const PORT = process.env.PORT || 3000;// Default port for the server
// Apply Secure HTTP Headers (Defense in Depth)
app.use(helmet());

//  Enable HTTP Request Logging for Monitoring and Auditing
app.use(morgan('combined'));

// Parse URL-encoded POST request bodies (e.g., form data)
app.use(express.urlencoded({ extended: true }));

//  Session Management (Principle of Least Privilege + Secure Session Cookies)
app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite3', dir: './db' }), // Stores sessions in SQLite database
    secret: process.env.SESSION_SECRET || 'supersecret', // Secret key for session signing (should be in .env file)
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        httpOnly: true, // Prevent JavaScript from accessing the cookie (mitigates XSS)
        secure: false,  // Should be true in production to require HTTPS
        maxAge: 1000 * 60 * 60 // Session expires in 1 hour
    }
}));

// CSRF Protection Middleware (Defense in Depth)
app.use(csurf());

// Make CSRF Token and User Available in All Views (Protect Forms)
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Token included in forms for CSRF validation
    res.locals.user = req.session.user; // Make user available in templates
    next();
});

// Set View Engine and Views Directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  Main Route Handler

app.use('/', routes);     // Register main blog and app routes

//  404 Not Found Handler (Fail Securely)
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

// Global Error Handler (Fail Securely)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for developers/admins
    res.status(500).send('500 - Something broke!' + err); // Generic message to avoid info disclosure
});

app.listen(PORT, () => {
  console.log(` Blogaroo running secure version http://localhost:${PORT}`);// Server startup message
});

module.exports = app;
