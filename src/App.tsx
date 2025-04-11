
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MMMGo from "./pages/MMMGo";
import LevelPage from "./pages/LevelPage";
import RankPage from "./pages/RankPage";
import InvestorsPage from "./pages/InvestorsPage";
import RatingPage from "./pages/RatingPage";
import StartScreen from "./pages/StartScreen";
import RulesPage from "./pages/RulesPage";

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <Routes>
        <Route path="/" element={<MMMGo />} />
        <Route path="/level" element={<LevelPage />} />
        <Route path="/rank" element={<RankPage />} />
        <Route path="/investors" element={<InvestorsPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </div>
  );
}
