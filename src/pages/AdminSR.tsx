
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminSR() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundTotal, setFundTotal] = useState(1000); // Примерная сумма фонда
  const token = localStorage.getItem("adminToken") || "";
  const [manualFund, setManualFund] = useState<number | null>(null);
const [isSavingFund, setIsSavingFund] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 20; // или любое удобное количество
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedPlayers = players.slice(startIndex, startIndex + itemsPerPage);
const totalPages = Math.ceil(players.length / itemsPerPage);

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
        p.tonWallet || "",
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
  const handleFundUpdate = async () => {
  if (manualFund === null || isNaN(manualFund)) return;
  setIsSavingFund(true);
  try {
    const res = await fetch("https://mmmgo-backend.onrender.com/admin/fund", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newTotal: manualFund })
    });
    const data = await res.json();
    if (data.success) {
      alert("Фонд обновлён");
      setFundTotal(data.newTotal); // обновим отображение
    } else {
      alert("Ошибка обновления фонда");
    }
  } catch (err) {
    console.error(err);
    alert("Ошибка сервера");
  } finally {
    setIsSavingFund(false);
  }
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
    <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ffd700", borderRadius: "8px" }}>
  <h3>✏️ Редактировать сумму фонда</h3>
  <input
    type="number"
    value={manualFund ?? ""}
    onChange={(e) => setManualFund(parseFloat(e.target.value))}
    placeholder="Введите сумму ($)"
    style={{ padding: "8px", width: "200px", marginRight: "10px" }}
  />
  <button
    onClick={handleFundUpdate}
    disabled={isSavingFund}
    style={{ padding: "8px 16px", cursor: "pointer" }}
  >
    {isSavingFund ? "Сохраняем..." : "Сохранить"}
  </button>
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
    <th>Кошелёк TON</th> {/* Поменял местами */}
    <th>Доля $</th>
  </tr>
</thead>
<tbody>
  {paginatedPlayers.map((p, i) => (
    <tr key={p.telegramId}>
        <td>{startIndex + i + 1}</td>
      <td>{p.telegramId}</td>
      <td>{p.playerName}</td>
      <td>{p.group}</td>
      <td>{p.srRating}</td>
      <td>{p.balance}</td>
      <td>{p.level}</td>
      <td>{p.premiumExpires ? new Date(p.premiumExpires).toLocaleDateString() : "—"}</td>
      <td>{p.srActiveSince ? new Date(p.srActiveSince).toLocaleDateString() : "—"}</td>
      <td>{p.tonWallet || "—"}</td>
      <td>
    {typeof p.usdtPayout === "number"
      ? `$${p.usdtPayout.toFixed(2)}`
      : "—"}
  </td>
    </tr>
  ))}
</tbody>
              </table>
              <div className="admin-pagination">
  <p>Страница {currentPage} из {totalPages}</p>
  <div>
    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&larr;</button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        className={currentPage === i + 1 ? "current-page" : ""}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}
    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&rarr;</button>
  </div>
</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}