# BlogarooApp

Link to Video Demonstration: https://youtu.be/VNWNMGNI3L0

Module: Secure Application Programming Project

Blogaroo Application (Insecure versions)

Student: Aloisio Pereira Junior


#  Blogaroo — insecure

This is an intentionally insecure version of Blogaroo, a basic blogging application built with Node.js, Express, and SQLite3. It is designed to demonstrate common web application vulnerabilities by omitting key security practices such as input validation, CSRF protection, secure session handling, and more.

---

##  Features

- Plaintext password storage (no hashing)
- SQL Injection vulnerabilities in login, registration, and search
- No input validation or sanitization
- No CSRF protection
- No security headers
- No role-based access control enforcement
- Hardcodd and weak session secret
- EJS templates vulnerable to XSS if improperly used



---

##  Requirements

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

---

##  Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AloisioPjr/BlogarooApp.git
   cd BlogarooApp
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
   /Password: “abc”
   ``
   
   or
   
   grant admin privileges to an existing account:
   
   go to your Blogaroo directory open the terminal and enter the following commands 
   
   make sure you have SQLite3 already installed in your system before proceding 
   
   check if you have it already installed with the following command:
   
   ```bash
   sqlite3 --version
   ```
 
   if not download here: https://www.sqlite.org/download.html
    
   ```bash
   sqlite3 db/database.sqlite3
   UPDATE users SET is_admin = 1 WHERE username = 'INPUT_YOUR_OWN_USERNAME_HERE';
   .exit
   ```


