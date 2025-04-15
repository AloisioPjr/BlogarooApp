# BlogarooApp

Link to Video Demonstration: https://youtu.be/VNWNMGNI3L0
Module: Secure Application Programming Project
Blogaroo Application (secure and Insecure versions)
Student: Aloisio Pereira Junior

#  Blogaroo — Secure Blogging Platform

Blogaroo is a secure web application built with **Node.js**, **Express**, and **SQLite3**, designed to demonstrate secure coding practices in a blogging platform. It implements session management, CSRF protection, secure headers, and form validation to protect against common vulnerabilities.

---

##  Features

- User Registration & Login (with hashed passwords)
- Create, Edit, and View Blog Posts
- Admins can delete any blog post
- Full-text blog search
- Secure headers (via Helmet)
- Input validation & sanitization (via express-validator)
- Logging (via Winston + Morgan)
- CSRF protection
- Session management stored in SQLite
- EJS templating

---

##  Requirements

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

---

##  Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/blogaroo.git
   cd blogaroo
   ```
   ```bash
   npm install
   ```
   ```bash
   npm start
   ```
   ``Visit: http://localhost:3000``
## Admin User Credencials

   ``username: “admin1234”
   /Password: “Password1234$”
   ``
   
   or
   
   grant admin privileges to an existing account:
   
   go to your Blogaroo directory open the terminal and enter the following commands
   
   ```bash
   sqlite3 db/database.sqlite3
   UPDATE users SET is_admin = 1 WHERE username = 'INPUT_YOUR_OWN_USERNAME_HERE';
   .exit
   ```


