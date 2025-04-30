
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";


export default function AdminSR() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPlayers: 0, top10Count: 0, totalTopSr: 0 });
  const token = localStorage.getItem("adminToken") || "";
 

  useEffect(() => {
    document.title = "SR Рейтинг | Админка MMM GO";
    fetch("https://mmmgo-backend.onrender.com/admin/sr-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        setStats({
          totalPlayers: data.totalPlayers,
          top10Count: data.top10Count,
          totalTopSr: data.totalTopSr,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки SR статистики:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600">SR Рейтинг игроков</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-700">
            <p>Всего участников с активной подпиской и SR &gt; 0: <strong>{stats.totalPlayers}</strong></p>
            <p>Топ 10% игроков: <strong>{stats.top10Count}</strong></p>
            <p>Суммарный SR в топ-10%: <strong>{stats.totalTopSr}</strong></p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Telegram ID</th>
                  <th className="p-2 border">Имя</th>
                  <th className="p-2 border">SR</th>
                  <th className="p-2 border">Баланс</th>
                  <th className="p-2 border">Уровень</th>
                  <th className="p-2 border">Подписка до</th>
                  <th className="p-2 border">SR с</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.telegramId} className="hover:bg-yellow-50">
                    <td className="p-2 border font-semibold">{i + 1}</td>
                    <td className="p-2 border font-mono text-sm">{p.telegramId}</td>
                    <td className="p-2 border text-left">{p.playerName}</td>
                    <td className="p-2 border font-bold text-blue-700">{p.srRating}</td>
                    <td className="p-2 border text-right">{p.balance}</td>
                    <td className="p-2 border">{p.level}</td>
                    <td className="p-2 border">
                      {p.premiumExpires ? new Date(p.premiumExpires).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-2 border">
                      {p.srActiveSince ? new Date(p.srActiveSince).toLocaleDateString() : "—"}
                    </td>
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




       
