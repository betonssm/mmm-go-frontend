
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvestorsOnly, setShowInvestorsOnly] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (!token) return;
    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPlayers(data.players))
      .catch((err) => console.error("Ошибка загрузки игроков:", err));
  }, [token]);

  const filtered = players.filter((p) => {
    const matchesSearch = p.playerName.toLowerCase().includes(search.toLowerCase()) ||
                          p.telegramId.toString().includes(search);
    const matchesInvestor = !showInvestorsOnly || p.isInvestor;
    return matchesSearch && matchesInvestor;
  });

  const handleTokenChange = (e) => {
    const value = e.target.value;
    setToken(value);
    localStorage.setItem("adminToken", value);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Админ-панель игроков</h1>

      <div className="mb-4">
        <label className="block mb-1">Admin Token</label>
        <input
          type="password"
          value={token}
          onChange={handleTokenChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени или ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-1/2"
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

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Telegram ID</th>
            <th className="p-2 border">Имя</th>
            <th className="p-2 border">Баланс</th>
            <th className="p-2 border">Уровень</th>
            <th className="p-2 border">Инвестор</th>
            <th className="p-2 border">SR-рейтинг</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((player) => (
            <tr key={player.telegramId}>
              <td className="p-2 border text-center">{player.telegramId}</td>
              <td className="p-2 border">{player.playerName}</td>
              <td className="p-2 border text-right">{player.balance}</td>
              <td className="p-2 border text-center">{player.level}</td>
              <td className="p-2 border text-center">{player.isInvestor ? "✅" : ""}</td>
              <td className="p-2 border text-right">{player.srRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  
       
