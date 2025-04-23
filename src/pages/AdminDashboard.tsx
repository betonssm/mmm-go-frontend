
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvestorsOnly, setShowInvestorsOnly] = useState(false);

  const token = localStorage.getItem("adminToken") || "";

  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Сортировка по окончанию подписки (новее выше)
        const sorted = data.players.sort((a, b) => {
          const aDate = a.premiumExpires ? new Date(a.premiumExpires) : 0;
          const bDate = b.premiumExpires ? new Date(b.premiumExpires) : 0;
          return bDate - aDate;
        });
        setPlayers(sorted);
      })
      .catch((err) => console.error("Ошибка загрузки игроков:", err));
  }, []);

  const filtered = players.filter((p) => {
    const matchesSearch = p.playerName.toLowerCase().includes(search.toLowerCase()) ||
      p.telegramId.toString().includes(search);
    const matchesInvestor = !showInvestorsOnly || p.isInvestor;
    return matchesSearch && matchesInvestor;
  });

  const getExpireStatus = (dateStr) => {
    if (!dateStr) return { text: "-", color: "text-gray-400" };
    const now = new Date();
    const date = new Date(dateStr);
    const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { text: date.toLocaleDateString(), color: "text-red-600 font-semibold" };
    if (daysLeft <= 3) return { text: `${date.toLocaleDateString()} ⏳`, color: "text-orange-500 font-medium" };

    return { text: date.toLocaleDateString(), color: "text-green-600" };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Админ-панель игроков</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени или ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded w-1/2"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showInvestorsOnly}
            onChange={(e) => setShowInvestorsOnly(e.target.checked)}
          />
          Только инвесторы
        </label>
      </div>

      <div className="overflow-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Telegram ID</th>
              <th className="p-2 border">Имя</th>
              <th className="p-2 border">Баланс</th>
              <th className="p-2 border">Уровень</th>
              <th className="p-2 border">Инвестор</th>
              <th className="p-2 border">SR</th>
              <th className="p-2 border">Подписка до</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => {
              const sub = getExpireStatus(player.premiumExpires);
              return (
                <tr key={player.telegramId} className="text-center hover:bg-gray-50">
                  <td className="p-2 border font-mono text-sm">{player.telegramId}</td>
                  <td className="p-2 border text-left">{player.playerName}</td>
                  <td className="p-2 border text-right">{player.balance}</td>
                  <td className="p-2 border">{player.level}</td>
                  <td className="p-2 border">{player.isInvestor ? "✅" : ""}</td>
                  <td className="p-2 border">{player.srRating}</td>
                  <td className={`p-2 border ${sub.color}`}>{sub.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
       
