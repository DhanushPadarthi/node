const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

const SECRET_KEY = 'cmrit-secret-key';
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve HTML files from the root directory
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, profession, password } = req.body;
    let users = JSON.parse(fs.readFileSync('database.json', 'utf8'));

    if (users.find(u => u.username === username)) {
        return res.send('Username already exists');
    }

    // Add new user to the "database.json"
    users.push({ username, profession, password });
    fs.writeFileSync('database.json', JSON.stringify(users, null, 2));

    // Redirect to login after successful registration
    res.redirect('/login.html');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let users = JSON.parse(fs.readFileSync('database.json', 'utf8'));
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.send('Invalid credentials');
    }

    // Generate JWT after successful login
    const token = jwt.sign({ username: user.username, profession: user.profession }, SECRET_KEY);

    // Redirect to profile page with the token
    res.redirect(`/profile.html?token=${token}`);
});

// Profile data API (protected)
app.get('/profile-data', (req, res) => {
    const token = req.query.token;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: "Welcome to CMRIT", username: decoded.username, profession: decoded.profession });
    } catch (err) {
        res.status(401).send('Invalid token');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
