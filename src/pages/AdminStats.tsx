
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    document.title = "Аналитика | Админка MMM GO";
    const token = localStorage.getItem("adminToken") || "";

    fetch("https://mmmgo-backend.onrender.com/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Ошибка загрузки аналитики:", err));
  }, []);

  if (!stats) return <p className="admin-loading">Загрузка аналитики...</p>;

  return (
    <div className="admin-stats">
      <h2>📈 Общая статистика</h2>
      <ul>
        <li><strong>Всего игроков:</strong> {stats.totalPlayers}</li>
        <li><strong>С рефералами:</strong> {stats.playersWithReferrals}</li>
        <li><strong>С активной подпиской:</strong> {stats.activeSubscriptions}</li>
        <li><strong>Покупок 50k мавродиков:</strong> {stats.topupPurchases}</li>
        <li><strong>Выполнено дневных миссий:</strong> {stats.completedDailyMissions}</li>
        <li><strong>Выполнено недельных миссий:</strong> {stats.completedWeeklyMissions}</li>
        <li><strong>Игроков с балансом &gt; 5 млн:</strong> {stats.playersWithLargeBalance}</li>
      </ul>
    </div>
  );
}



       
