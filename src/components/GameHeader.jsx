import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GameHeader.css";

export default function GameHeader({ totalScore }) {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/");
  }

  return (
    <div className="game-header">
      <div className="score-box">Total Score: {totalScore}</div>

      <h1 className="game-title">Memory Game</h1>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("userEmail");
          window.location.href = "/";
        }}>
        Logout
      </button>

    </div>
  );
}
