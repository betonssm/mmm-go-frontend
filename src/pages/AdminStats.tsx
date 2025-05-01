
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
    <div className="admin-content">
      <h2 className="admin-title">📈 Общая статистика</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <tbody>
            <tr>
              <td><strong>Всего игроков</strong></td>
              <td>{stats.totalPlayers}</td>
            </tr>
            <tr>
              <td><strong>С рефералами</strong></td>
              <td>{stats.playersWithReferrals}</td>
            </tr>
            <tr>
              <td><strong>С активной подпиской</strong></td>
              <td>{stats.activeSubscriptions}</td>
            </tr>
            <tr>
              <td><strong>Покупок 50k мавродиков</strong></td>
              <td>{stats.topups50k}</td>
            </tr>
            <tr>
              <td><strong>Выполнено дневных миссий</strong></td>
              <td>{stats.completedDailyMissions}</td>
            </tr>
            <tr>
              <td><strong>Выполнено недельных миссий</strong></td>
              <td>{stats.completedWeeklyMissions}</td>
            </tr>
            <tr>
              <td><strong>Игроков с балансом &gt; 5 млн</strong></td>
              <td>{stats.playersWithLargeBalance}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}



       
