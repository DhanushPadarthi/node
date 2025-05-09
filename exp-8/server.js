const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET = 'cmritsecret'; // JWT secret key

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cmrit_users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: String,
    profession: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Serve HTML pages
const path = require('path');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));

// Register API
app.post('/api/register', async (req, res) => {
    const { username, profession, password } = req.body;
    const user = new User({ username, profession, password });
    await user.save();
    res.redirect('/login');
});

// Login API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.send('Invalid credentials');

    const token = jwt.sign({ username, profession: user.profession }, SECRET, { expiresIn: '1h' });
    res.json({ token });

});

// Profile API
app.get('/api/profile', (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('No token provided');

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token');
        res.json({ message: "Welcome to CMRIT", username: decoded.username, profession: decoded.profession });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
