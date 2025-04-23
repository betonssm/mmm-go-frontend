
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://mmmgo-backend.onrender.com/admin/overview", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Неверный токен или ошибка доступа");
      const json = await res.json();
      setData(json);
      setAuthorized(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!authorized) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">🔐 Вход в админку</h1>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-2"
          type="password"
          placeholder="Введите токен"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Админ-панель</h1>
      <p className="mb-4">Всего игроков: <strong>{data.totalPlayers}</strong></p>
      <p className="mb-6">Общий фонд: <strong>{data.fundTotal} USDT</strong></p>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Telegram ID</th>
              <th className="p-2 border">Имя</th>
              <th className="p-2 border">Баланс</th>
              <th className="p-2 border">Уровень</th>
              <th className="p-2 border">Инвестор</th>
              <th className="p-2 border">SR рейтинг</th>
            </tr>
          </thead>
          <tbody>
            {data.players.map((p: any) => (
              <tr key={p.telegramId} className="text-center">
                <td className="p-2 border">{p.telegramId}</td>
                <td className="p-2 border">{p.playerName}</td>
                <td className="p-2 border">{p.balance}</td>
                <td className="p-2 border">{p.level}</td>
                <td className="p-2 border">{p.isInvestor ? "✅" : "❌"}</td>
                <td className="p-2 border">{p.srRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
