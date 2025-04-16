
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function RankPage() {
  const navigate = useNavigate();

  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [adsWatched, setAdsWatched] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dailyClicks, setDailyClicks] = useState(0);
  const [weeklyMavro, setWeeklyMavro] = useState(0);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user) {
      setTelegramId(user.id);

      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setAdsWatched(data.adsWatched || 0);
          setIsSubscribed(data.partnerSubscribed || false);
          setDailyClicks(data.dailyTasks?.dailyTaps || 0);
          setWeeklyMavro(data.weeklyMission?.current || 0);
        })
        .catch(err => console.error("Ошибка загрузки данных игрока", err));
    }
  }, []);

  const sendTestTasks = () => {
    if (!telegramId) return;

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        playerName: "Игрок",
        dailyTasks: {
          dailyTaps: dailyClicks,
          dailyTarget: 5000,
          rewardReceived: dailyClicks >= 5000,
        },
        weeklyMission: {
          mavrodikGoal: 1000000,
          current: weeklyMavro,
          completed: weeklyMavro >= 1000000,
        },
        partnerSubscribed: isSubscribed,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Обновлено", data))
      .catch((err) => console.error("❌ Ошибка", err));
  };

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rank.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "30px 16px 60px",
        minHeight: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h2 className="section-title">🎯 Задания</h2>

      {/* 📺 Просмотры рекламы */}
      <div className="task-block">
        <h3>🎥 Просмотры рекламы</h3>
        <p>Посмотрено сегодня: <strong>{adsWatched}/5</strong></p>
        <button className="task-button">▶ Посмотреть видео</button>
      </div>

      {/* 📢 Подписка на партнёра */}
      <div className="task-block">
        <h3>📢 Подпишись на партнёра</h3>
        <p>Канал: <strong>@example_channel</strong></p>
        {isSubscribed ? (
          <div className="task-complete">✅ Подписка подтверждена</div>
        ) : (
          <button className="task-button" onClick={() => setIsSubscribed(true)}>📎 Я подписался</button>
        )}
      </div>

      {/* 🔁 Ежедневные задания */}
      <div className="task-block">
        <h3>🌀 Ежедневные задания</h3>
        <p>Натапай 5 000 мавродиков<br />Прогресс: <strong>{dailyClicks}/5000</strong></p>
        <button className="task-button" disabled={dailyClicks < 5000}>🎁 Забрать награду</button>
      </div>

      {/* 🧭 Миссия недели */}
      <div className="task-block">
        <h3>🧭 Миссия недели</h3>
        <p>Накопи 1 000 000 мавродиков<br />Прогресс: <strong>{weeklyMavro}/1000000</strong></p>
        <button className="task-button" disabled={weeklyMavro < 1000000}>🎁 Забрать награду</button>
      </div>

      <button onClick={sendTestTasks} className="task-button" style={{ marginTop: 20 }}>
        ✅ Сохранить прогресс
      </button>

      <button className="back-button" onClick={() => navigate("/")}>
        🔙 Назад
      </button>
    </div>
  );
}