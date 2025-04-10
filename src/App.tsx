
import React from "react";
import { Routes, Route } from "react-router-dom";
import MMMGo from "./pages/MMMGo";
import LevelPage from "./pages/LevelPage";
import RankPage from "./pages/RankPage";
import InvestorsPage from "./pages/InvestorsPage";
import RatingPage from "./pages/RatingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MMMGo />} />
      <Route path="/level" element={<LevelPage />} />
      <Route path="/rank" element={<RankPage />} />
      <Route path="/investors" element={<InvestorsPage />} />
      <Route path="/rating" element={<RatingPage />} />
    </Routes>
  );
}
