const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
  secret: 'cmrit-secret',
  resave: false,
  saveUninitialized: true
}));

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cmrit_users');

// Model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  profession: String,
  password: String
}));

// Routes
app.get('/', (req, res) => res.send('<h2>Welcome</h2><a href="/register">Register</a> | <a href="/login">Login</a>'));

app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.post('/api/register', async (req, res) => {
  await new User(req.body).save();
  res.redirect('/login');
});

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.send('<h2>Login failed</h2><a href="/login">Try again</a>');

  req.session.user = { username: user.username, profession: user.profession };
  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  res.send(`
    <h2>Welcome to CMRIT</h2>
    <p>Username: ${req.session.user.username}</p>
    <p>Profession: ${req.session.user.profession}</p>
    <a href="/logout">Logout</a>
  `);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log('http://localhost:' + PORT));
