// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models/db');// Insecure DB it allows SQL injection in queries
const routes = require('./routes');

const app = express();
const PORT = 3000;

//------------ Middlewares
app.use(bodyParser.urlencoded({ extended: false })); //No input validation or sanitization is used here this makes the app vulnerable to SQL Injection and XSS attacks
app.use(express.static(path.join(__dirname, 'public')));// If user uploads were allowed here, they could serve malicious scripts (e.g., .js files)
app.use(session({
    secret: 'superinsecuresecret', // Hardcoded and weak secret session secret can be brute-forced, session hijacking is possible
    resave: false,
    saveUninitialized: true//May create sessions even for unauthenticated users
}));

//-------------- View engine ( note: EJS is not secure by default, and it can be vulnerable to XSS attacks if user input is not properly escaped)(e.g., using <%- instead of <%=)/
// /No role-based access control middleware here (admin-only routes should be restricted))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {// Make the session user available in all views
  res.locals.user = req.session.user;
  next();
});

//----------------- Routes (no input validation or sanitization is used here this makes the app vulnerable to SQL Injection and XSS attacks)
//  No CSRF protection is implemented
// No security headers (e.g., Content Security Policy, X-Content-Type-Options)
app.use('/', routes);


app.listen(PORT, () => {
    console.log(` Insecure Blogaroo running on http://localhost:${PORT}`);
});
