import React from "react";
import "../styles/GameCard.css";

export default function GameCard({ card, isFlipped, onClick }) {
  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">{card.symbol}</div>
        <div className="card-back">🎴</div>
      </div>
    </div>
  );
}
