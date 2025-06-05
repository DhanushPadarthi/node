const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();

const DB_FILE = "./database.json";
const PORT = 3000;
const SECRET_KEY = "mysecret";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Read and write functions
function getUsers() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function saveUsers(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Show main page
app.get("/", (req, res) => {
  res.send(`
    <h2>Welcome</h2>
    <a href="/register">Register</a><br>
    <a href="/login">Login</a>
  `);
});

// Show register and login pages
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Register new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.send("User already exists");

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  users.push({ username, password, token });
  saveUsers(users);

  res.send("Registered successfully");
});

// Login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("Wrong details");

  res.send("Login success");
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
