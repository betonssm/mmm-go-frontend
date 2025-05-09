
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
import AdminSR from "./pages/AdminSR";
import ProtectedAdmin from "./pages/ProtectedAdmin"; // добавь импорт
import AdminLogin from "./pages/AdminLogin";


Modal.setAppElement("#root");
function MaintenancePage() {
  return (
    <div style={{ padding: "60px", textAlign: "center", background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h1>🔧 Технические работы</h1>
      <p>Мы проводим обновление. Попробуйте позже 🙏</p>
    </div>
  );
}


export default function App() {
  const [started, setStarted] = useState(false);
  const location = useLocation();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 добавили
  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/player/status")
      .then(res => res.json())
      .then(data => {
        setIsMaintenance(data.maintenance === true);
      })
      .catch(err => {
        console.error("Ошибка получения статуса:", err);
        setIsMaintenance(false);
      })
      .finally(() => setLoading(false)); // 👈 обязательно!
  }, []);


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
  if (loading) return null;

  // 🛠 Проверяем сначала maintenance
if (isMaintenance) {
  return <MaintenancePage />;
}

// 🎮 Потом проверяем старт
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
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<DashboardLayout><ProtectedAdmin page="dashboard" /></DashboardLayout>} />
<Route path="/admin/logs" element={<DashboardLayout><ProtectedAdmin page="logs" /></DashboardLayout>} />
<Route path="/admin/stats" element={<DashboardLayout><ProtectedAdmin page="stats" /></DashboardLayout>} />
<Route path="/admin/sr" element={<DashboardLayout><ProtectedAdmin page="sr" /></DashboardLayout>} />
      </Routes>
    </div>
  );
}
