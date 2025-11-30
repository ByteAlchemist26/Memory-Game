import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "../components/GameHeader";
import GameCard from "../components/GameCard";
import "../styles/GameInterface.css";
import generateCards from "../data/cards";

export default function GamePage() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const userEmail = localStorage.getItem("userEmail");

  // Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Please enter your name first!");
      navigate("/");
      return;
    }
    
    // Initialize cards
    setCards(generateCards());
  }, [navigate]);

  // Send score to backend (optional)
  function sendScoreToBackend(finalScore) {
    const email = localStorage.getItem("userEmail");
    fetch(`http://localhost:5000/user/${email}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: finalScore }),
    }).catch(err => console.log("Demo mode - backend skipped"));
  }

  // Start a new game
  function startGame() {
    setGameStarted(true);
    setGameWon(false);
    setSelected([]);
    setScore(0);
    setCards(generateCards());
  }

  // Handle card click / matching
  function handleCardClick(index) {
    if (selected.length === 2) return;
    if (!gameStarted) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    // Prevent clicking the same card twice
    if (newSelected.length === 2 && newSelected[0] === newSelected[1]) {
      setSelected([]);
      return;
    }

    if (newSelected.length === 2) {
      const [i1, i2] = newSelected;

      if (cards[i1].symbol === cards[i2].symbol) {
        const updated = [...cards];
        updated[i1].matched = true;
        updated[i2].matched = true;

        setCards(updated);
        setSelected([]);
        setScore(prev => prev + 10);

        const allMatched = updated.every(card => card.matched);

        if (allMatched) {
          const finalScore = score + 10 + 100;
          setTotalScore(prev => prev + finalScore);
          sendScoreToBackend(finalScore);
          setGameWon(true);
        }
      } else {
        setTimeout(() => setSelected([]), 800);
      }
    }
  }

  // Main UI
  return (
    <div className="game-container">
      <GameHeader totalScore={totalScore} />
      <p className="user-email">Logged in as: {userEmail}</p>

      <div className="center-area">
        {/* WIN SCREEN */}
        {gameWon && (
          <div className="win-screen">
            <h1 className="win-text">🎉 YOU WON! 🎉</h1>
            <p className="win-sub">+100 bonus points added</p>

            <button className="play-btn" onClick={startGame}>
              Play Again
            </button>
          </div>
        )}

        {/* BEFORE GAME START */}
        {!gameStarted && !gameWon && (
          <button className="play-btn" onClick={startGame}>
            Play
          </button>
        )}

        {/* GAME GRID */}
        {gameStarted && !gameWon && (
          <div className="grid-container">
            {cards.map((card, index) => (
              <GameCard
                key={card.id || index}
                card={card}
                isFlipped={selected.includes(index) || card.matched}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}