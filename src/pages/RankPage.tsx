
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
  const [bgLoaded, setBgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoWatched, setVideoWatched] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [adStartTime, setAdStartTime] = useState<number | null>(null);
  const [adWaiting, setAdWaiting] = useState(false);

  // Получить данные игрока
  const fetchPlayerData = (userId = telegramId) => {
    if (!userId) return;
    fetch(`https://mmmgo-backend.onrender.com/player/${userId}`)
      .then(res => res.json())
      .then(data => {
        setAdsWatched(data.adsWatched || 0);
        setIsSubscribed(data.partnerSubscribed || false);
        setDailyClicks(data.dailyTasks?.dailyTaps || 0);
        setRewardCollected(data.dailyTasks?.rewardReceived || false);
        setWeeklyMavro(data.weeklyMission?.current || 0);
        setWeeklyReward(data.weeklyMission?.completed || false);
        if (data.youtubeBonusLast) {
  const last = new Date(data.youtubeBonusLast);
  const now = new Date();
  setVideoWatched(last.toDateString() === now.toDateString());
} else {
  setVideoWatched(false);
}// если добавишь в backend поле videoWatched
      })
      .catch(err => console.error("Ошибка загрузки данных игрока", err));
  };

  // Загрузка данных при входе
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (user) {
      setTelegramId(user.id);
      fetchPlayerData(user.id);
    }
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  // Фон
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-rank.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  // Логика начисления бонуса за просмотр рекламы
  useEffect(() => {
    function onFocus() {
      if (!adWaiting || !adStartTime) return;
      const elapsed = (Date.now() - adStartTime) / 1000;
      if (elapsed >= 15) {
        const newCount = adsWatched + 1;
        fetch("https://mmmgo-backend.onrender.com/player", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegramId,
            adsWatched: newCount,
            balanceBonus: 1000
          }),
          keepalive: true,
        })
          .then(res => res.json())
          .then(() => {
            showTempNotice("✅ +1 000 мавродиков за бонусную активность!");
            fetchPlayerData();
          })
          .catch(err => {
            console.error("❌ Ошибка при сохранении рекламы:", err);
            showTempNotice("🚫 Ошибка подключения");
          });
      } else {
        showTempNotice("⏳ Посмотри рекламу минимум 15 секунд для получения бонуса!");
      }
      setAdStartTime(null);
      setAdWaiting(false);
    }

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line
  }, [adWaiting, adStartTime, adsWatched, telegramId]);

  // Показывать уведомление
  const showTempNotice = (msg: string) => {
    setShowNotice(msg);
    setTimeout(() => setShowNotice(null), 4000);
  };

  // Ежедневная награда
  const claimDailyReward = () => {
    if (!telegramId) return;
    if (rewardCollected) return showTempNotice("🎁 Награда уже получена сегодня!");
    if (dailyClicks < 5000) return showTempNotice("❌ Надо натапать 5 000 мавродиков!");

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
        balanceBonus: 0,
      }),
      keepalive: true,
    })
      .then(res => res.json())
      .then(() => {
        showTempNotice("✅ +5 000 мавродиков за ежедневное задание!");
        fetchPlayerData();
      })
      .catch(err => {
        console.error("❌ Ошибка выдачи ежедневной награды:", err);
        showTempNotice("🚫 Ошибка при получении награды");
      });
  };

  // Недельная награда
  const claimWeeklyReward = async () => {
    if (!telegramId) return;
    try {
      const res = await fetch(`https://mmmgo-backend.onrender.com/player/${telegramId}`);
      const player = await res.json();
      if (!player.weeklyMission) {
        setShowNotice("🚫 Данные о задании недоступны.");
        setTimeout(() => setShowNotice(null), 4000);
        return;
      }

      const current = player.weeklyMission?.current ?? 0;
      const completed = player.weeklyMission?.completed ?? false;

      setWeeklyMavro(current);

      if (completed) {
        setShowNotice("🎁 Награда уже получена на этой неделе!");
        setTimeout(() => setShowNotice(null), 4000);
        return;
      }

      if (current < 100000) {
        setShowNotice("❌ Надо накопить 100 000 мавродиков!");
        setTimeout(() => setShowNotice(null), 4000);
        return;
      }

      await fetch("https://mmmgo-backend.onrender.com/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          weeklyMission: {
            mavrodikGoal: 100000,
            current: 0,
            completed: true,
          },
          balanceBonus: 0,
        }),
      });

      setShowNotice("🏆 Ты получил 10 000 мавродиков за неделю!");
      setWeeklyMavro(0);
      setWeeklyReward(true);
      setTimeout(() => setShowNotice(null), 4000);
      fetchPlayerData();
    } catch (err) {
      console.error("❌ Ошибка при проверке недельного прогресса:", err);
      setShowNotice("🚫 Ошибка подключения");
      setTimeout(() => setShowNotice(null), 4000);
    }
  };

  // Просмотр рекламы
  const handleAdWatch = () => {
    if (!telegramId || adsWatched >= 5 || adWaiting) return;
    setAdStartTime(Date.now());
    setAdWaiting(true);
    window.open("https://wikipedia.org", "_blank"); // можно заменить на партнёрский сайт
    showTempNotice("🎬 Контент открыт. Возвращайся через 15 секунд для бонуса...");
  };

  // Просмотр видео MMMGO (YouTube)
  const handleYouTubeBonus = () => {
    if (videoWatched) return; // чтобы не фармили
    setVideoWatched(true);
    setNotice("✅ +1 000 мавродиков за просмотр видео!");
    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        videoWatched: true,
        balanceBonus: 1000,
      }),
      keepalive: true,
    }).then(() => {
      fetchPlayerData();
      setTimeout(() => setNotice(null), 3500);
    });
  };

  // Подписка на партнёра
  const handleSubscribe = () => {
    if (!telegramId) return;
    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, partnerSubscribed: true }),
      keepalive: true,
    })
      .then(res => res.json())
      .then(() => {
        setIsSubscribed(true);
        fetchPlayerData();
      })
      .catch(err => console.error(err));
  };

  if (loading || !bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: "url(/assets/bg-rank.png)",
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
      {showNotice && <div className="task-notification">{showNotice}</div>}

      {/* Просмотры видео */}
      <div className="task-block">
        <h3>🎬 Бонус за просмотр</h3>
        <p>Посмотрено сегодня: <strong>{adsWatched}/5</strong></p>
        <button className="task-button" disabled={adsWatched >= 5} onClick={handleAdWatch}>
          🎁 Получить бонус
        </button>
      </div>
      <div className="task-block">
        <h3>📺 Посмотри новое видео MMMGO</h3>
        <div className="video-frame">
          <iframe
            width="100%"
            height="180"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video MMMGO"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        </div>
        <button
  className="task-button"
  onClick={async () => {
    if (!telegramId) return;
    try {
      const res = await fetch('https://mmmgo-backend.onrender.com/player/youtube-bonus', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId }),
      });
      const data = await res.json();
      if (data.success) {
        setVideoWatched(true);
        setNotice("✅ +1 000 мавродиков за просмотр видео!");
        fetchPlayerData();
      } else {
        setVideoWatched(true);
        setNotice("⚠️ Бонус уже получен сегодня!");
      }
      setTimeout(() => setNotice(null), 3500);
    } catch {
      setNotice("🚫 Ошибка, попробуй позже");
      setTimeout(() => setNotice(null), 3500);
    }
  }}
  disabled={videoWatched}
>
  {videoWatched ? "Бонус получен" : "Я посмотрел(а)"}
</button>
        {notice && (
          <div
            style={{
              marginTop: 12,
              background: "#e6fff4",
              color: "#09b876",
              borderRadius: 8,
              fontSize: 15,
              padding: "8px 0",
              textAlign: "center",
              fontWeight: 600,
              boxShadow: "0 0 8px #b7ffdb77",
            }}
          >
            {notice}
          </div>
        )}
      </div>
      {/* Остальные блоки — как у тебя */}
      <div className="task-block">
        <h3>📢 Подпишись на наш новостной канал </h3>
        <p>Канал: <strong>@example_channel</strong></p>
        {isSubscribed
          ? <div className="task-complete">✅ Подписка подтверждена</div>
          : <button className="task-button" onClick={handleSubscribe}>📎 Я подписался</button>
        }
      </div>
      <div className="task-block">
        <h3>🌀 Ежедневные задания</h3>
        <p>Натапай 5 000 мавродиков<br />Прогресс: <strong>{dailyClicks}/5000</strong></p>
        <button
          className="task-button"
          onClick={claimDailyReward}
          disabled={rewardCollected}
        >🎁 Забрать награду</button>
      </div>
      <div className="task-block">
        <h3>🧭 Миссия недели</h3>
        <p>Накопи 100 000 мавродиков<br />Прогресс: <strong>{weeklyMavro}/100000</strong></p>
        <button
          className="task-button"
          onClick={claimWeeklyReward}
          disabled={weeklyReward}
        >🎁 Забрать награду</button>
      </div>
      <button className="back-button" onClick={() => navigate("/")}>🔙 Назад</button>
    </div>
  );
}