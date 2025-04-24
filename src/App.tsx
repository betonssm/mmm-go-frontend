
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
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import AdminDashboard from "./pages/AdminDashboard";
import Modal from "react-modal";
import DashboardLayout from "./pages/DashboardLayout";
import AdminLogs from "./pages/AdminLogs";
import AdminStats from "./pages/AdminStats";



Modal.setAppElement("#root");


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
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/topup" element={<TopUpPage />} />
        <Route path="/" element={<MMMGo />} />
        <Route path="/level" element={<LevelPage />} />
        <Route path="/rank" element={<RankPage />} />
        <Route path="/referrals" element={<ReferralPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
  <Route path="/admin/logs" element={<DashboardLayout><AdminLogs /></DashboardLayout>} />
  <Route path="/admin/stats" element={<DashboardLayout><AdminStats /></DashboardLayout>} />
      </Routes>
    </div>
  );
}
