const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET = 'secret'; // keep one short key

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cmrit_users');

// Schema
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  profession: String,
  password: String
}));

// Serve HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));

// Register
app.post('/api/register', async (req, res) => {
  await new User(req.body).save();
  res.redirect('/login');
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const u = await User.findOne({ username, password });
  if (!u) return res.send('Invalid');
  const token = jwt.sign({ username: u.username, profession: u.profession }, SECRET);
  res.json({ token });
});

// Profile
app.get('/api/profile', (req, res) => {
  try {
    const d = jwt.verify(req.headers.authorization, SECRET);
    res.json({ message: "Welcome to CMRIT", username: d.username, profession: d.profession });
  } catch {
    res.status(403).send("Invalid token");
  }
});

app.listen(PORT, () => console.log("http://localhost:" + PORT));
