const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();

const SECRET = "cmrit-secret";
const DB = "database.json";

app.use(express.urlencoded({ extended: true }));

// Serve pages
app.get("/", (_, r) => r.sendFile(path.join(__dirname, "index.html")));
app.get("/register.html", (_, r) => r.sendFile(path.join(__dirname, "register.html")));
app.get("/login.html", (_, r) => r.sendFile(path.join(__dirname, "login.html")));
app.get("/profile.html", (_, r) => r.sendFile(path.join(__dirname, "profile.html")));

// Register
app.post("/register", (req, res) => {
  const { username, profession, password } = req.body;
  let users = JSON.parse(fs.readFileSync(DB, "utf8"));
  if (users.find(u => u.username === username)) return res.send("User exists");
  users.push({ username, profession, password });
  fs.writeFileSync(DB, JSON.stringify(users, null, 2));
  res.redirect("/login.html");
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = JSON.parse(fs.readFileSync(DB));
  let user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("Invalid login");
  const token = jwt.sign({ username: user.username, profession: user.profession }, SECRET);
  res.redirect(`/profile.html?token=${token}`);
});

// Profile API
app.get("/profile-data", (req, res) => {
  try {
    const d = jwt.verify(req.query.token, SECRET);
    res.json({ message: "Welcome to CMRIT", username: d.username, profession: d.profession });
  } catch {
    res.status(401).send("Invalid token");
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));
