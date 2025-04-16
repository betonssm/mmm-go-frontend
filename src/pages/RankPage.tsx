
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
  const [rewardCollected, setRewardCollected] = useState(false);
  const [weeklyReward, setWeeklyReward] = useState(false);

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
          setRewardCollected(data.dailyTasks?.rewardReceived || false);
          setWeeklyMavro(data.weeklyMission?.current || 0);
          setWeeklyReward(data.weeklyMission?.completed || false);
        })
        .catch(err => console.error("Ошибка загрузки данных игрока", err));
    }
  }, []);

  const claimDailyReward = () => {
    if (!telegramId || rewardCollected || dailyClicks < 5000) return;

    setRewardCollected(true);

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        dailyTasks: {
          dailyTaps: dailyClicks,
          dailyTarget: 5000,
          rewardReceived: true,
        },
        balanceBonus: 5000, // награда
      }),
    });
  };

  const claimWeeklyReward = () => {
    if (!telegramId || weeklyReward || weeklyMavro < 1000000) return;

    setWeeklyReward(true);

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        weeklyMission: {
          mavrodikGoal: 1000000,
          current: weeklyMavro,
          completed: true,
        },
        balanceBonus: 10000,
      }),
    });
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
        <button
          className="task-button"
          disabled={adsWatched >= 5}
          onClick={() => {
            if (!telegramId || adsWatched >= 5) return;
            const newCount = adsWatched + 1;
            setAdsWatched(newCount);

            fetch("https://mmmgo-backend.onrender.com/player", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                telegramId,
                adsWatched: newCount,
              }),
            });
          }}
        >
          ▶ Посмотреть видео
        </button>
      </div>

      {/* 📢 Подписка на партнёра */}
      <div className="task-block">
        <h3>📢 Подпишись на партнёра</h3>
        <p>Канал: <strong>@example_channel</strong></p>
        {isSubscribed ? (
          <div className="task-complete">✅ Подписка подтверждена</div>
        ) : (
          <button
            className="task-button"
            onClick={() => {
              if (!telegramId) return;
              setIsSubscribed(true);
              fetch("https://mmmgo-backend.onrender.com/player", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  telegramId,
                  partnerSubscribed: true,
                }),
              });
            }}
          >
            📎 Я подписался
          </button>
        )}
      </div>

      {/* 🔁 Ежедневные задания */}
      <div className="task-block">
        <h3>🌀 Ежедневные задания</h3>
        <p>Натапай 5 000 мавродиков<br />Прогресс: <strong>{dailyClicks}/5000</strong></p>
        <button
          className="task-button"
          onClick={claimDailyReward}
          disabled={rewardCollected || dailyClicks < 5000}
        >
          🎁 Забрать 5000 мавродиков
        </button>
      </div>

      {/* 🧭 Миссия недели */}
      <div className="task-block">
        <h3>🧭 Миссия недели</h3>
        <p>Накопи 1 000 000 мавродиков<br />Прогресс: <strong>{weeklyMavro}/1000000</strong></p>
        <button
          className="task-button"
          onClick={claimWeeklyReward}
          disabled={weeklyReward || weeklyMavro < 1000000}
        >
          🎁 Забрать 10 000 мавродиков
        </button>
        <button
  className="task-button"
  onClick={() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (!user) return;

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId: user.id,
        balanceBonus: 10000, // 👈 тестовая сумма
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ balanceBonus обновлён", data))
      .catch((err) => console.error("❌ Ошибка при сохранении bonus", err));
  }}
>
  💰 Тест баланса (10 000)
</button>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        🔙 Назад
      </button>
    </div>
    
  );
}