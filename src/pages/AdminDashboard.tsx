
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvestorsOnly, setShowInvestorsOnly] = useState(false);
  const [sortField, setSortField] = useState("balance");
  const [sortOrder, setSortOrder] = useState("desc");
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [inputToken, setInputToken] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlayers(data.players))
      .catch((err) => console.error("Ошибка загрузки игроков:", err));
  }, [token]);

  const handleLogin = () => {
    localStorage.setItem("adminToken", inputToken);
    setToken(inputToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setInputToken("");
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filtered = players
    .filter((p) => {
      const matchesSearch =
        p.playerName.toLowerCase().includes(search.toLowerCase()) ||
        p.telegramId.toString().includes(search);
      const matchesInvestor = !showInvestorsOnly || p.isInvestor;
      return matchesSearch && matchesInvestor;
    })
    .sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  if (!token) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-xl font-bold mb-4">🔐 Вход в админ-панель</h1>
        <input
          type="password"
          placeholder="Введите токен..."
          className="p-2 border w-full rounded mb-4"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎛 Админ-панель</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline"
        >
          Выйти
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени или ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
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

      <table className="w-full table-auto border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border cursor-pointer" onClick={() => handleSort("telegramId")}>Telegram ID</th>
            <th className="p-3 border">Имя</th>
            <th className="p-3 border cursor-pointer" onClick={() => handleSort("balance")}>Баланс</th>
            <th className="p-3 border cursor-pointer" onClick={() => handleSort("level")}>Уровень</th>
            <th className="p-3 border">Инвестор</th>
            <th className="p-3 border cursor-pointer" onClick={() => handleSort("srRating")}>SR</th>
            <th className="p-3 border">Подписка до</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((player) => (
            <tr key={player.telegramId} className="hover:bg-gray-50">
              <td className="p-3 border text-center">{player.telegramId}</td>
              <td className="p-3 border whitespace-nowrap">{player.playerName}</td>
              <td className="p-3 border text-right">{player.balance}</td>
              <td className="p-3 border text-center">{player.level}</td>
              <td className="p-3 border text-center">{player.isInvestor ? "✅" : ""}</td>
              <td className="p-3 border text-right">{player.srRating}</td>
              <td className="p-3 border text-center">
                {player.premiumExpires ? new Date(player.premiumExpires).toLocaleDateString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  
       
