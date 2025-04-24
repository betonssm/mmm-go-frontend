
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Игроки | Админка MMM GO";
  }, []);
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvestorsOnly, setShowInvestorsOnly] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [resetId, setResetId] = useState("");
  const token = localStorage.getItem("adminToken") || "";
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
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
    const matchesSearch =
      p.playerName.toLowerCase().includes(search.toLowerCase()) ||
      p.telegramId.toString().includes(search);
    const matchesInvestor = !showInvestorsOnly || p.isInvestor;
    return matchesSearch && matchesInvestor;
  });

  const getExpireStatus = (dateStr: string | null) => {
    if (!dateStr) return { text: "-", color: "text-gray-400" };
    const now = new Date();
    const date = new Date(dateStr);
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { text: date.toLocaleDateString(), color: "text-red-600 font-semibold" };
    if (daysLeft <= 3) return { text: `${date.toLocaleDateString()} ⏳`, color: "text-orange-500 font-medium" };
    return { text: date.toLocaleDateString(), color: "text-green-600" };
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="text"
          placeholder="Поиск по имени или ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded w-full md:w-1/2"
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

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="ID игрока для сброса"
          value={resetId}
          onChange={(e) => setResetId(e.target.value)}
          className="p-3 border rounded w-full md:w-1/3"
        />
        <button
          onClick={async () => {
            if (!resetId) return alert("Введите ID игрока");
            const ok = confirm(`Сбросить миссии для ${resetId}?`);
            if (ok) {
              const res = await fetch(
                `https://mmmgo-backend.onrender.com/admin/reset-player/${resetId}`,
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (res.ok) {
                alert(`✅ Миссии сброшены для ${resetId}`);
              } else {
                const err = await res.json();
                alert(`❌ Ошибка: ${err.error}`);
              }
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
        >
          🔄 Сбросить миссии игрока
        </button>
      </div>
      <button
  onClick={() => navigate("/admin/analytics")}
  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
>
  📈 Аналитика
</button>

      <div className="overflow-auto">
        <table className="w-full border border-gray-300 text-sm text-center">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Telegram ID</th>
              <th className="p-2 border">Имя</th>
              <th className="p-2 border">Баланс</th>
              <th className="p-2 border">Уровень</th>
              <th className="p-2 border">Инвестор</th>
              <th className="p-2 border">SR</th>
              <th className="p-2 border">Подписка до</th>
              <th className="p-2 border">Рефералы</th>
              <th className="p-2 border">Оплаты</th>
              <th className="p-2 border">Источник</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player, index) => {
              const sub = getExpireStatus(player.premiumExpires);
              return (
                <tr
                  key={player.telegramId}
                  className="hover:bg-yellow-50 cursor-pointer"
                  onClick={() => setSelectedPlayer(player)}
                >
                  <td className="p-2 border font-semibold">{index + 1}.</td>
                  <td className="p-2 border font-mono text-sm">{player.telegramId}</td>
                  <td className="p-2 border text-left">{player.playerName}</td>
                  <td className="p-2 border text-right">{player.balance}</td>
                  <td className="p-2 border">{player.level}</td>
                  <td className="p-2 border">{player.isInvestor ? "✅" : ""}</td>
                  <td className="p-2 border">{player.srRating}</td>
                  <td className={`p-2 border ${sub.color}`}>{sub.text}</td>
                  <td className="p-2 border">{player.referrals || 0}</td>
                  <td className="p-2 border">{player.paymentsCount || 0}</td>
                  <td className="p-2 border">{player.refSource || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedPlayer}
        onRequestClose={() => setSelectedPlayer(null)}
        className="bg-white p-6 rounded max-w-xl w-full shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedPlayer && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              👤 Игрок: {selectedPlayer.playerName}
            </h2>
            <ul className="text-sm space-y-2 text-gray-700">
              <li><strong>ID:</strong> {selectedPlayer.telegramId}</li>
              <li><strong>Баланс:</strong> {selectedPlayer.balance}</li>
              <li><strong>Уровень:</strong> {selectedPlayer.level}</li>
              <li><strong>Инвестор:</strong> {selectedPlayer.isInvestor ? "Да" : "Нет"}</li>
              <li><strong>Рефералов:</strong> {selectedPlayer.referrals}</li>
              <li><strong>Рейтинг SR:</strong> {selectedPlayer.srRating}</li>
              <li>
                <strong>Подписка до:</strong>{" "}
                {selectedPlayer.premiumExpires
                  ? new Date(selectedPlayer.premiumExpires).toLocaleDateString()
                  : "—"}
              </li>
              <li><strong>Источник регистрации:</strong> {selectedPlayer.refSource || "—"}</li>
              <li><strong>Оплат:</strong> {selectedPlayer.paymentsCount || 0}</li>
            </ul>
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>
      </>
  );
}


       
