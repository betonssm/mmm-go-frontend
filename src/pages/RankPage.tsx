
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function RankPage() {
  const navigate = useNavigate();

  const [adsWatched, setAdsWatched] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dailyTaps, setDailyTaps] = useState(0);
  const [weeklyBalance, setWeeklyBalance] = useState(0);

  // имитация рекламы
  const watchAd = () => {
    setAdsWatched((prev) => prev + 1);
    alert("🎥 Реклама просмотрена! +500 мавродиков");
  };

  // подписка
  const handleSubscription = () => {
    setIsSubscribed(true);
    alert("✅ Спасибо за подписку! +1000 мавродиков");
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
      <h2 className="section-title">🎯 Задания MMM GO</h2>

      {/* 🎥 Реклама */}
      <div className="task-block">
        <h3>🎥 Просмотры рекламы</h3>
        <p>Просмотрено сегодня: {adsWatched}/5</p>
        <button
          disabled={adsWatched >= 5}
          onClick={watchAd}
          className="task-button"
        >
          Смотреть видео
        </button>
      </div>

      {/* 📢 Подписка */}
      <div className="task-block">
        <h3>📢 Подписка на партнёра</h3>
        <p>Канал: <strong>@example_channel</strong></p>
        {isSubscribed ? (
          <p>✅ Подписка подтверждена</p>
        ) : (
          <button onClick={handleSubscription} className="task-button">
            Я подписался
          </button>
        )}
      </div>

      {/* 🌀 Ежедневные задания */}
      <div className="task-block">
        <h3>🌀 Ежедневное задание</h3>
        <p>Натапай 10 000 мавродиков: {dailyTaps}/10000</p>
        <progress value={dailyTaps} max={10000}></progress>
      </div>

      {/* 🧭 Миссия недели */}
      <div className="task-block">
        <h3>🧭 Миссия недели</h3>
        <p>Накопи 1 000 000 мавродиков: {weeklyBalance}/1000000</p>
        <progress value={weeklyBalance} max={1000000}></progress>
      </div>

      <button
        onClick={() => navigate("/")}
        className="back-btn"
        style={{ marginTop: "30px" }}
      >
        🔙 Назад
      </button>
    </div>
  );
}