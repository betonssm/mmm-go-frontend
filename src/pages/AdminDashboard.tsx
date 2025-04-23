
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvestorsOnly, setShowInvestorsOnly] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem("admin_token"));
  const [fundTotal, setFundTotal] = useState(0);

  useEffect(() => {
    if (!token) return;

    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        setFundTotal(data.fundTotal || 0);
      })
      .catch((err) => console.error("Ошибка загрузки игроков:", err));
  }, [token]);

  const handleTokenSubmit = () => {
    localStorage.setItem("admin_token", token);
    setShowTokenInput(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setShowTokenInput(true);
    setPlayers([]);
  };

  const filtered = players.filter((p) => {
    const matchesSearch =
      p.playerName.toLowerCase().includes(search.toLowerCase()) ||
      p.telegramId.toString().includes(search);
    const matchesInvestor = !showInvestorsOnly || p.isInvestor;
    return matchesSearch && matchesInvestor;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Админ-панель игроков</h1>

      {showTokenInput ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Введите токен администратора..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleTokenSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Войти
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">🔐 Вы вошли как администратор</p>
          <button
            onClick={handleLogout}
            className="px-4 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Выйти
          </button>
        </div>
      )}

      <div className="flex gap-4 mb-4">
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

      <div className="mb-4 text-sm text-gray-600">
        📊 Текущий фонд: <span className="font-semibold">{fundTotal.toFixed(2)} USDT</span>
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
  
       
