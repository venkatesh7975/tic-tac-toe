const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
