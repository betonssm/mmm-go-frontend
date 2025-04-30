
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
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600">SR Рейтинг игроков</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-700">
            <p>Суммарный SR в топ-10%: <strong>{srSummary.totalTopSR}</strong></p>
            <p className="text-gray-500 italic">* Только игроки с активной подпиской и SR &gt; 0</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Telegram ID</th>
                  <th className="p-2 border">Имя</th>
                  <th className="p-2 border">Группа</th>
                  <th className="p-2 border">SR</th>
                  <th className="p-2 border">Баланс</th>
                  <th className="p-2 border">Уровень</th>
                  <th className="p-2 border">Подписка до</th>
                  <th className="p-2 border">SR с</th>
                  <th className="p-2 border">Доля $</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.telegramId} className="hover:bg-yellow-50">
                    <td className="p-2 border font-semibold">{i + 1}</td>
                    <td className="p-2 border font-mono text-sm">{p.telegramId}</td>
                    <td className="p-2 border text-left">{p.playerName}</td>
                    <td className="p-2 border font-bold text-indigo-600">{p.group}</td>
                    <td className="p-2 border text-blue-700 font-semibold">{p.srRating}</td>
                    <td className="p-2 border text-right">{p.balance}</td>
                    <td className="p-2 border">{p.level}</td>
                    <td className="p-2 border">{p.premiumExpires ? new Date(p.premiumExpires).toLocaleDateString() : "—"}</td>
                    <td className="p-2 border">{p.srActiveSince ? new Date(p.srActiveSince).toLocaleDateString() : "—"}</td>
                    <td className="p-2 border font-bold text-green-700">${calculatePayout(p)}</td>
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




       
