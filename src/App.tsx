
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MMMGo from "./pages/MMMGo";
import LevelPage from "./pages/LevelPage";
import RankPage from "./pages/RankPage";
// import InvestorsPage from "./pages/InvestorsPage"; ⛔️ больше не нужен
import RatingPage from "./pages/RatingPage";
import StartScreen from "./pages/StartScreen";
import RulesPage from "./pages/RulesPage";
import ReferralPage from "./pages/ReferralPage"; // ✅ добавили рефералы
import TopUpPage from "./pages/TopUpPage";

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <Routes>
      <Route path="/topup" element={<TopUpPage />} />
        <Route path="/" element={<MMMGo />} />
        <Route path="/level" element={<LevelPage />} />
        <Route path="/rank" element={<RankPage />} />
        <Route path="/referrals" element={<ReferralPage />} /> {/* ✅ заменили investors */}
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </div>
  );
}
