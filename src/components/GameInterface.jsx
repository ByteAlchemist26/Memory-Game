// src/components/GameInterface.jsx
import React from "react";
import "../styles/GameInterface.css";

const GameInterface = ({ setScore }) => {
  const handlePlayGame = () => {
    // just for demo, increase score on click
    setScore(prev => prev + 10);
  };

  return (
    <div className="game-container">
      <button className="play-btn" onClick={handlePlayGame}>
        Play
      </button>
    </div>
  );
};

export default GameInterface;
