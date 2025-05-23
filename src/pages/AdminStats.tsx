
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [suspiciousPlayers, setSuspiciousPlayers] = useState([]);
  const token = localStorage.getItem("adminToken") || ""; // ✅ Глобально доступен
 const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(suspiciousPlayers.length / itemsPerPage);

const paginatedSuspicious = suspiciousPlayers.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  useEffect(() => {
    document.title = "Аналитика | Админка MMM GO";

    fetch("https://mmmgo-backend.onrender.com/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Ошибка загрузки аналитики:", err));
  }, []);

  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/admin/suspicious-taps", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSuspiciousPlayers(data.players || []))
      .catch(err => console.error("Ошибка загрузки подозрительных таперов:", err));
  }, []);

  if (!stats) return <p className="admin-loading">Загрузка аналитики...</p>;

  return (
    <div className="admin-content">
      <div className="admin-card">
  <h3>⚠️ Подозрительная активность</h3>
  <ul>
  {paginatedSuspicious.length === 0
    ? <p>Нет подозрительной активности</p>
    : paginatedSuspicious.map(p => (
        <li key={p.telegramId}>
          {p.playerName || "Без имени"} (ID: {p.telegramId}) — {p.dailyTasks.dailyTaps} тапов
        </li>
      ))
  }
</ul>
 {totalPages > 1 && (
    <div className="admin-pagination">
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
        ←
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "current-page" : ""}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
        →
      </button>
    </div>
  )}
</div>
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



       
