import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem("userEmail", name);
      navigate("/game");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>🎮 Memory Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleStart()}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "300px",
          marginBottom: "10px"
        }}
      />
      <br />
      <button
        onClick={handleStart}
        disabled={!name.trim()}
        style={{
          padding: "10px 30px",
          fontSize: "16px",
          cursor: name.trim() ? "pointer" : "not-allowed"
        }}
      >
        Start Game
      </button>
    </div>
  );
}

export default Login;