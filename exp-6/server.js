const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();

const DB_FILE = "./database.json";
const PORT = 3000;

// Middleware to parse URL-encoded and JSON body (no body-parser)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Homepage route for "/"
app.get("/", (req, res) => {
    res.send(`
      <h2>Welcome to the JWT Auth App</h2>
      <p><a href="/register">Go to Register Page</a></p>
      <p><a href="/login">Go to Login Page</a></p>
    `);
  });
  

// Serve static HTML pages
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Middleware to validate JWT
function validateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, "secret_key");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

// Read and write to database.json
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Register Route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = readDB();

  // Check if user already exists
  if (users.find((u) => u.username === username)) {
    return res.send("User already exists");
  }

  // Create token on registration
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  // Store user with token
  users.push({ username, password, token });
  writeDB(users);

  res.send("User registered successfully with token.");
});


// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = readDB();
  
    const user = users.find((u) => u.username === username && u.password === password);
  
    if (!user) {
      return res.send("Not Verified User");
    }
  
    res.send("Verified User");
  });
  

// Protected route
app.get("/protected", validateToken, (req, res) => {
  res.send(`Hello, ${req.user.username}. You are verified.`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
