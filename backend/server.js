const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Replace with your MySQL password
  database: "users", // Replace with your MySQL database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  app.listen(port, () => {
    console.log("Server running on port", port);
  });
  console.log("Connected to MySQL");
});

// Middleware to validate request body
const validateRequestBody = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  next();
};

// POST endpoint to register a new user
app.post("/register", validateRequestBody, async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO user_details (username, password) VALUES (?, ?)";
    await connection.promise().query(sql, [username, hashedPassword]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Error registering user" });
  }
});

// POST endpoint to handle user login
app.post("/login", validateRequestBody, async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM user_details WHERE username = ?";
    const [rows] = await connection.promise().query(sql, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ error: "Error logging in user" });
  }
});

// GET endpoint to fetch all users (just for reference, not required for login)
app.get("/", (req, res) => {
  connection.query("SELECT * FROM user_details", (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.json(rows);
  });
});

// Simple in-memory game state
let gameBoard = Array(9).fill(null); // Represents the Tic Tac Toe board

// Reset the game board
function resetGame() {
  gameBoard = Array(9).fill(null);
}

// Endpoint to get current game state
app.get("/api/board", (req, res) => {
  res.json({ board: gameBoard });
});

// Endpoint to make a move
app.post("/api/move", (req, res) => {
  const { index, player } = req.body;

  if (index >= 0 && index < gameBoard.length && !gameBoard[index]) {
    gameBoard[index] = player;
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid move" });
  }
});

// Endpoint to reset the game
app.post("/api/reset", (req, res) => {
  resetGame();
  res.json({ success: true });
});
