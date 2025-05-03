
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminSR() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundTotal, setFundTotal] = useState(1000); // Примерная сумма фонда
  const token = localStorage.getItem("adminToken") || "";

  useEffect(() => {
    document.title = "SR Рейтинг | Админка MMM GO";
    fetch("https://mmmgo-backend.onrender.com/admin/sr-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.topPlayers);        // ← сюда записываем уже обработанных игроков
        setFundTotal(data.total);           // ← общий фонд в USDT
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки SR статистики:", err);
        setLoading(false);
      });
  }, []);

  
  const exportCSV = (group) => {
    const groupPlayers = players.filter(p =>
      (group === "top1" && p.group === "1%") ||
      (group === "top5" && p.group === "2-5%") ||
      (group === "top10" && p.group === "6-10%")
    );
  
    const csvContent = [
      ["TelegramID", "Имя", "SR", "Группа", "Кошелёк", "USDT"],
      ...groupPlayers.map(p => [
        p.telegramId,
        p.playerName || "",
        p.srRating,
        p.group,
        p.walletAddressTRC20 || "",
        p.usdtPayout
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
  <p><strong>Общий фонд для выплат:</strong> {fundTotal.toFixed(2)} USDT</p>
  <p className="admin-note">* Выплаты рассчитаны по SR-группам в топ-10%</p>
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
    <th>Кошелёк TRC20</th> {/* Поменял местами */}
    <th>Доля $</th>
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
      <td>{p.walletAddressTRC20 || "—"}</td> {/* Поменял местами */}
      <td>${p.usdtPayout}</td>
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