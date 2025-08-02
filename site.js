const express = require("express");
const session = require("express-session");
const startpairing = require("./pair");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "frontend")));

app.use(session({
  secret: "kunle-secret", // change to something stronger
  resave: false,
  saveUninitialized: true,
}));

// Hardcoded users
const users = [
  { username: "kunle", password: "gabi" },
  { username: "admin", password: "1234" }
];

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

let currentPairingNumber = null;
const pairedNumbersPath = path.join(__dirname, "../richstore/pairing/pairedNumbers.json");

if (!fs.existsSync(pairedNumbersPath)) {
  fs.writeFileSync(pairedNumbersPath, JSON.stringify([]));
}

function saveNumber(number) {
  const list = JSON.parse(fs.readFileSync(pairedNumbersPath, "utf8"));
  if (!list.includes(number)) {
    list.push(number);
    fs.writeFileSync(pairedNumbersPath, JSON.stringify(list, null, 2));
  }
}

// Routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsers = [
    { username: "tmkadmin", password: "1234" },
    { username: "martin", password: "martin1" },
    { username: "timi", password: "timi1" },
    { username: "gabimaru", password: "4567" }
  ];

  const found = validUsers.find(u => u.username === username && u.password === password);
  if (!found) return res.status(401).send("Invalid credentials");

  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/dashboard", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
});

app.get("/pair", requireLogin, async (req, res) => {
  const number = req.query.number;
  if (!number) return res.status(400).send("Phone number is required");

  currentPairingNumber = number;
  saveNumber(number);
  await startpairing(number);
  res.send("Pairing has started, please check /pairing-code ENDPOINT");
});

app.get("/pairing-code", requireLogin, (req, res) => {
  try {
    const filePath = path.join(__dirname, "../richstore/pairing/pairing.json");
    if (fs.existsSync(filePath)) {
      const codeData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.json({ code: codeData.code, number: currentPairingNumber });
    } else {
      res.status(404).json({ error: "Pairing code not yet available" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error reading pairing code" });
  }
});

app.get("/paired", requireLogin, (req, res) => {
  try {
    const list = JSON.parse(fs.readFileSync(pairedNumbersPath, "utf8"));
    res.json({ numbers: list });
  } catch {
    res.status(500).json({ error: "Could not load paired numbers." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});