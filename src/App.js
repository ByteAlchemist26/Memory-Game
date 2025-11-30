import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;