
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Игроки | Админка MMM GO";
  }, []);

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvestorsOnly, setShowInvestorsOnly] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [resetId, setResetId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [addBalanceId, setAddBalanceId] = useState("");
const [addBalanceAmount, setAddBalanceAmount] = useState("");

  const itemsPerPage = 15;
  const token = localStorage.getItem("adminToken") || "";
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: { Authorization: `Bearer ${token}` },
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
  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/admin/maintenance", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMaintenance(data.maintenanceMode))
      .catch(err => console.error("Ошибка загрузки статуса:", err));
  }, []);
  const toggleMaintenance = () => {
    fetch("https://mmmgo-backend.onrender.com/admin/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ maintenanceMode: !maintenance }),
    })
      .then(res => res.json())
      .then(() => setMaintenance(prev => !prev))
      .catch(err => console.error("Ошибка обновления статуса:", err));
  };

  const filtered = players.filter((p) => {
    const matchesSearch =
      p.playerName.toLowerCase().includes(search.toLowerCase()) ||
      p.telegramId.toString().includes(search);
    const matchesInvestor = !showInvestorsOnly || p.isInvestor;
    return matchesSearch && matchesInvestor;
  });

  const pageStart = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(pageStart, pageStart + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getExpireStatus = (dateStr) => {
    if (!dateStr) return { text: "-", color: "gray" };
    const now = new Date();
    const date = new Date(dateStr);
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { text: date.toLocaleDateString(), color: "expired" };
    if (daysLeft <= 3) return { text: `${date.toLocaleDateString()} ⏳`, color: "warning" };
    return { text: date.toLocaleDateString(), color: "active" };
  };
  const handleGiveSubscription = async () => {
  const confirm = window.confirm("Выдать подписку этому игроку?");
  if (!confirm) return;

  try {
    const res = await fetch("https://mmmgo-backend.onrender.com/admin/give-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // из localStorage// в .env
      },
      body: JSON.stringify({ telegramId: selectedPlayer.telegramId }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("✅ Подписка успешно выдана!");
    } else {
      alert("Ошибка: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Ошибка при запросе");
  }
};

  const handleReset = async () => {
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
  };

  return (
    <div className="admin-wrapper">
      <main className="admin-content">
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Поиск по имени или ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={showInvestorsOnly}
              onChange={(e) => setShowInvestorsOnly(e.target.checked)}
            />
            Только инвесторы
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
  <h3>🛠 Режим технических работ</h3>
  <button onClick={toggleMaintenance}>
    {maintenance ? "Отключить" : "Включить"} технические работы
  </button>
</div>

        <div className="admin-controls">
          <input
            type="text"
            placeholder="ID игрока для сброса"
            value={resetId}
            onChange={(e) => setResetId(e.target.value)}
          />
          <button onClick={handleReset}>🔄 Сбросить миссии игрока</button>
        </div>
        <div className="admin-action-box">
  <h4>➕ Добавить баланс игроку</h4>
  <input
    placeholder="ID игрока"
    value={addBalanceId}
    onChange={(e) => setAddBalanceId(e.target.value)}
  />
  <input
    placeholder="Сумма"
    value={addBalanceAmount}
    type="number"
    onChange={(e) => setAddBalanceAmount(e.target.value)}
  />
  <button
    onClick={async () => {
      if (!addBalanceId || !addBalanceAmount) return alert("Заполни все поля");
      const ok = confirm(`Добавить ${addBalanceAmount} мавродиков игроку ${addBalanceId}?`);
      if (!ok) return;

      const res = await fetch("https://mmmgo-backend.onrender.com/admin/add-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          telegramId: Number(addBalanceId),
          amount: Number(addBalanceAmount),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Баланс успешно добавлен");
        setAddBalanceId("");
        setAddBalanceAmount("");
      } else {
        alert("❌ Ошибка: " + data.error);
      }
    }}
  >
    Добавить баланс
  </button>
</div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Telegram ID</th>
                <th>Имя</th>
                <th>Баланс</th>
                <th>Уровень</th>
                <th>Инвестор</th>
                <th>SR</th>
                <th>Подписка до</th>
                <th>Рефералы</th>
                <th>Оплаты</th>
                <th>Источник</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((player, i) => {
                const sub = getExpireStatus(player.premiumExpires);
                return (
                  <tr key={player.telegramId} onClick={() => setSelectedPlayer(player)}>
                    <td>{pageStart + i + 1}</td>
                    <td>{player.telegramId}</td>
                    <td>{player.playerName}</td>
                    <td>{player.balance}</td>
                    <td>{player.level}</td>
                    <td>{player.isInvestor ? "✅" : ""}</td>
                    <td>{player.srRating}</td>
                    <td className={sub.color}>{sub.text}</td>
                    <td>{player.referrals || 0}</td>
                    <td>{player.donatesCount || 0}</td>
                    <td>{player.refSource || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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

        <Modal
          isOpen={!!selectedPlayer}
          onRequestClose={() => setSelectedPlayer(null)}
          className="admin-modal"
          overlayClassName="admin-modal-overlay"
        >
          {selectedPlayer && (
            <div>
              <h2>👤 Игрок: {selectedPlayer.playerName}</h2>
              <ul>
                <li><strong>ID:</strong> {selectedPlayer.telegramId}</li>
                <li><strong>Баланс:</strong> {selectedPlayer.balance}</li>
                <li><strong>Уровень:</strong> {selectedPlayer.level}</li>
                <li><strong>Инвестор:</strong> {selectedPlayer.isInvestor ? "Да" : "Нет"}</li>
                <li><strong>Рефералов:</strong> {selectedPlayer.referrals}</li>
                <li><strong>Рейтинг SR:</strong> {selectedPlayer.srRating}</li>
                <li><strong>Подписка до:</strong> {selectedPlayer.premiumExpires ? new Date(selectedPlayer.premiumExpires).toLocaleDateString() : "—"}</li>
                <li><strong>Источник регистрации:</strong> {selectedPlayer.refSource || "—"}</li>
                <li><strong>Оплат:</strong> {selectedPlayer.paymentsCount || 0}</li>
              </ul>
              <button onClick={handleGiveSubscription} style={{ marginTop: "12px" }}>
  🎟 Выдать подписку вручную
</button>
              <button onClick={() => setSelectedPlayer(null)}>Закрыть</button>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

       
