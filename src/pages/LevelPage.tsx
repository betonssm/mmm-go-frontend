
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function LevelPage() {
  const navigate = useNavigate();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [balance, setBalance] = useState(0);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const levels = [
    { id: 1, name: "Новичок", required: 0 },
    { id: 2, name: "Подающий надежды", required: 10000 },
    { id: 3, name: "Местный вкладчик", required: 50000 },
    { id: 4, name: "Серьёзный игрок", required: 100000 },
    { id: 5, name: "Опытный инвестор", required: 300000 },
    { id: 6, name: "Финансовый магнат", required: 600000 },
    { id: 7, name: "Серый кардинал", required: 1000000 },
    { id: 8, name: "Тайный куратор", required: 2500000 },
    { id: 9, name: "Легенда MMMGO", required: 5000000 },
  ];

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-levels.png";
    img.onload = () => setBgLoaded(true);

    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user) {
      setTelegramId(user.id);
      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setBalance(data.balance || 0);
        });
    }
  }, []);

  if (!bgLoaded) return <div className="loading-screen">Загрузка...</div>;

  const currentLevelId = levels
    .slice()
    .reverse()
    .find(level => balance >= level.required)?.id;

  return (
    <div
      className="level-page"
      style={{
        backgroundImage: `url(/assets/bg-levels.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "30px 16px 60px",
        minHeight: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h2 className="section-title">📶 Уровни игрока</h2>

      <div className="levels-list">
        {levels.map(level => (
          <div
            key={level.id}
            className={`level-block ${
              level.id === currentLevelId ? "current-level" : ""
            }`}
          >
            <h3>
              {level.id}. {level.name}
            </h3>
            <p>
              Необходимо: <strong>{level.required.toLocaleString()} мавродиков</strong>
            </p>
          </div>
        ))}
      </div>
      <button
 className={`exchange-button ${currentLevelId !== 9 ? "disabled" : ""}`}
  onClick={() => {
    if (currentLevelId === 9) setShowModal(true);
  }}
>
  💱 Обменять 5 000 000 мавродиков на 100 MMMGO
</button>
 
      <button className="back-button" onClick={() => navigate("/")}>
        🔙 Назад
      </button>
      {showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>🎯 Обмен на токен MMMGO</h2>
      <p>
        Достигнув максимального уровня и накопив 5 млн мавродиков,
        ты можешь обменять их на <strong>100 токенов MMMGO</strong>.
        <br /><br />
        Эти токены будут отображаться в твоём аккаунте и смогут быть
        выведены после листинга токена.
      </p>
      <button onClick={() => setShowModal(false)} className="task-button">
        🔒 Понял
      </button>
    </div>
  </div>
      )}
    </div>
 )}
