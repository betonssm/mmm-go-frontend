
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminSR() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [srSummary, setSrSummary] = useState(null);
  const [fundTotal, setFundTotal] = useState(1000); // Примерная сумма фонда
  const token = localStorage.getItem("adminToken") || "";

  useEffect(() => {
    document.title = "SR Рейтинг | Админка MMM GO";
    fetch("https://mmmgo-backend.onrender.com/admin/sr-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const combined = [...data.top1, ...data.top5, ...data.top10];
        setPlayers(combined);
        setSrSummary(data.srSummary);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки SR статистики:", err);
        setLoading(false);
      });
  }, []);

  const calculatePayout = (player) => {
    if (!srSummary) return 0;
    const groupWeight = player.group === "1%" ? 0.3 : player.group === "2-5%" ? 0.35 : 0.35;
    const groupTotalSR = srSummary[player.group === "1%" ? "top1" : player.group === "2-5%" ? "top5" : "top10"] || 1;
    const share = player.srRating / groupTotalSR;
    return Math.round(share * fundTotal * groupWeight);
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">SR Рейтинг игроков</h1>
  
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="sr-summary">
            <p>Суммарный SR в топ-10%: <strong>{srSummary.totalTopSR}</strong></p>
            <p className="note">* Только игроки с активной подпиской и SR &gt; 0</p>
          </div>
  
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Telegram ID</th>
                  <th>Имя</th>
                  <th>Группа</th>
                  <th>SR</th>
                  <th>Баланс</th>
                  <th>Уровень</th>
                  <th>Подписка до</th>
                  <th>SR с</th>
                  <th>Доля $</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.telegramId}>
                    <td>{i + 1}</td>
                    <td className="monospace">{p.telegramId}</td>
                    <td className="text-left">{p.playerName}</td>
                    <td className="highlight">{p.group}</td>
                    <td className="blue-bold">{p.srRating}</td>
                    <td className="text-right">{p.balance}</td>
                    <td>{p.level}</td>
                    <td>{p.premiumExpires ? new Date(p.premiumExpires).toLocaleDateString() : "—"}</td>
                    <td>{p.srActiveSince ? new Date(p.srActiveSince).toLocaleDateString() : "—"}</td>
                    <td className="green-bold">${calculatePayout(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
