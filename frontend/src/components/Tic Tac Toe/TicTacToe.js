import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate from react-router-dom

import "bootstrap/dist/css/bootstrap.min.css";
import "./TicTacToe.css"; // Assuming you have a separate CSS file for custom styles

function TicTacToe({ onLogout }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [loggedOut, setLoggedOut] = useState(false); // State to track logout

  useEffect(() => {
    fetchBoard();
  }, []);
  const handleLogout = () => {
    onLogout(); // Call the parent component's logout function
    setLoggedOut(true); // Set loggedOut state to true
  };
  if (loggedOut) {
    return <Navigate to="/" />;
  }

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
    <div className="container mt-5 m-3 p-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <div className="card-body text-center">
              <h1 className="card-title">Tic Tac Toe</h1>
              {winner ? (
                <h2 className="card-subtitle mb-3">Winner: {winner}</h2>
              ) : (
                <h2 className="card-subtitle mb-3">Next Player: {player}</h2>
              )}
              <div className="board">
                {board.map((cell, index) => (
                  <div
                    key={index}
                    className={`cell border text-center p-4 ${
                      cell === "X"
                        ? "text-primary"
                        : cell === "O"
                        ? "text-danger"
                        : ""
                    }`}
                    onClick={() => makeMove(index)}
                  >
                    {cell}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-3" onClick={resetGame}>
                Reset Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicTacToe;
