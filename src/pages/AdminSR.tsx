
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
  const exportCSV = (group) => {
    if (!srSummary || !["top1", "top5", "top10"].includes(group)) return;
  
    const groupPlayers = players.filter(p =>
      (group === "top1" && p.group === "1%") ||
      (group === "top5" && p.group === "2-5%") ||
      (group === "top10" && p.group === "6-10%")
    );
  
    const csvContent = [
      ["TelegramID", "Имя", "SR", "Кошелёк", "Доля USDT"],
      ...groupPlayers.map(p => [
        p.telegramId,
        p.playerName,
        p.srRating,
        p.walletAddressTRC20 || "",
        calculatePayout(p)
      ])
    ].map(e => e.join(",")).join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${group}_MMMGO_PAYOUT.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-wrapper">
      <main className="admin-content">
        <h2 className="admin-title">📊 SR Рейтинг игроков</h2>
  
        {loading ? (
  <p>Загрузка...</p>
) : (
  <>
    <div style={{ marginBottom: "16px" }}>
      <button onClick={() => exportCSV("top1")} style={{ marginRight: 8 }}>⬇️ Скачать ТОП 1%</button>
      <button onClick={() => exportCSV("top5")} style={{ marginRight: 8 }}>⬇️ ТОП 2–5%</button>
      <button onClick={() => exportCSV("top10")}>⬇️ ТОП 6–10%</button>
    </div>
            <div className="admin-summary">
              <p><strong>Суммарный SR в топ-10%:</strong> {srSummary.totalTopSR}</p>
              <p className="admin-note">* Только игроки с активной подпиской и SR &gt; 0</p>
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
                    <th>Кошелёк TRC20</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p, i) => (
                    <tr key={p.telegramId}>
                      <td>{i + 1}</td>
                      <td>{p.telegramId}</td>
                      <td>{p.playerName}</td>
                      <td>{p.group}</td>
                      <td>{p.srRating}</td>
                      <td>{p.balance}</td>
                      <td>{p.level}</td>
                      <td>{p.premiumExpires ? new Date(p.premiumExpires).toLocaleDateString() : "—"}</td>
                      <td>{p.srActiveSince ? new Date(p.srActiveSince).toLocaleDateString() : "—"}</td>
                      <td>${calculatePayout(p)}</td>
                      <td>{p.walletAddressTRC20 || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}