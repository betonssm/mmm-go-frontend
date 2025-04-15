
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // 🔒 Блокируем скролл только на главной странице
  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/topup" element={<TopUpPage />} />
        <Route path="/" element={<MMMGo />} />
        <Route path="/level" element={<LevelPage />} />
        <Route path="/rank" element={<RankPage />} />
        <Route path="/referrals" element={<ReferralPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </div>
  );
}
