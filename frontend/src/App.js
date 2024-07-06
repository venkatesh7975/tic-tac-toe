import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    const response = await fetch("http://localhost:4000/api/board");
    const data = await response.json();
    setBoard(data.board);
  };

  const makeMove = async (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }

    const response = await fetch("http://localhost:4000/api/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index, player }),
    });

    const result = await response.json();
    if (result.success) {
      setBoard([...board.slice(0, index), player, ...board.slice(index + 1)]);
      setPlayer(player === "X" ? "O" : "X");
    }
  };

  const resetGame = async () => {
    await fetch("http://localhost:4000/api/reset", { method: "POST" });
    setBoard(Array(9).fill(null));
    setPlayer("X");
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      {winner ? <h2>Winner: {winner}</h2> : <h2>Next Player: {player}</h2>}
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="cell" onClick={() => makeMove(index)}>
            {cell}
          </div>
        ))}
      </div>
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default App;
