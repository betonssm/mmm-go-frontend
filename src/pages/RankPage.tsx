
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
  const [showNotice, setShowNotice] = useState<string | null>(null);

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
    if (!telegramId) return;

    if (rewardCollected) {
      setShowNotice("🎁 Награда уже получена сегодня!");
      setTimeout(() => setShowNotice(null), 4000);
      return;
    }

    if (dailyClicks < 5000) {
      setShowNotice("❌ Надо натапать 5 000 мавродиков!");
      setTimeout(() => setShowNotice(null), 4000);
      return;
    }

    setRewardCollected(true);

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        dailyTasks: {
          dailyTaps: dailyClicks,
          dailyTarget: 5000,
          rewardReceived: true
        },
        balanceBonus: 5000
      }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          if (data.error === "Награда за сегодня уже получена") {
            setShowNotice("🎁 Награда уже получена сегодня!");
          } else {
            setShowNotice("🚫 Ошибка: " + data.error);
          }
          setTimeout(() => setShowNotice(null), 4000);
        });
      } else {
        return res.json().then(() => {
          setShowNotice("✅ +5 000 мавродиков за ежедневное задание!");
          setRewardCollected(true);
          setTimeout(() => setShowNotice(null), 4000);
        });
      }
    })
    .catch(err => {
      console.error("❌ Ошибка выдачи награды:", err);
      setShowNotice("🚫 Ошибка при попытке получить награду");
      setTimeout(() => setShowNotice(null), 4000);
    });
  };

  const claimWeeklyReward = () => {
    if (!telegramId) return;
  
    if (weeklyReward) {
      setShowNotice("🎁 Награда уже получена на этой неделе!");
      setTimeout(() => setShowNotice(null), 4000);
      return;
    }
  
    if (weeklyMavro < 100000) {
      setShowNotice("❌ Надо накопить 100 000 мавродиков!");
      setTimeout(() => setShowNotice(null), 4000);
      return;
    }
  
    setWeeklyReward(true); // временно блокируем кнопку
  
    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        weeklyMission: {
          mavrodikGoal: 100000,
          current: 0,
          completed: true,
        },
        balanceBonus: 10000,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Ошибка при получении награды");
          });
        }
        return res.json();
      })
      .then(() => {
        setShowNotice("🏆 Ты получил 10 000 мавродиков за неделю!");
        setWeeklyMavro(0);
        setTimeout(() => setShowNotice(null), 4000);
      })
      .catch((err) => {
        setWeeklyReward(false); // отменяем блокировку, если ошибка
        if (err.message.includes("уже получена")) {
          setShowNotice("🎁 Награда уже была получена на этой неделе!");
        } else {
          setShowNotice("🚫 Ошибка при выдаче награды");
        }
        setTimeout(() => setShowNotice(null), 4000);
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
      {showNotice && (
  <div className="task-notification">
    {showNotice}
  </div>
)}
 

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
        <button className="task-button" onClick={claimDailyReward}>
          🎁 Забрать награду
        </button>
      </div>

   
 

      {/* 🧭 Миссия недели */}
      <div className="task-block">
  <h3>🧭 Миссия недели</h3>
  <p>
    Накопи 1 00 000 мавродиков<br />
    Прогресс: <strong>{weeklyMavro}/100000</strong>
  </p>
  <button className="task-button" onClick={claimWeeklyReward}>
    🎁 Забрать награду
  </button>

        
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        🔙 Назад
      </button>
    </div>
    
  );
}