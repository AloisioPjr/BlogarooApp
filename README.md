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
  
   ```bash
   npm install
   
