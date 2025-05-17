
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
  const [loading, setLoading] = useState(true); // 👈
  const [showVideoModal, setShowVideoModal] = useState(false);
const [videoEnded, setVideoEnded] = useState(false);
const [isLoading, setIsLoading] = useState(false);

  // Загрузка начальных данных игрока
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
        .catch(err => console.error("Ошибка загрузки данных игрока", err))
        .finally(() => setLoading(false)); // ✅ ЭТО ОБЯЗАТЕЛЬНО
      } else {
        setLoading(false); // 🛡 Если user нет — тоже не вешаться
      }
  }, []);
  useEffect(() => {
  const img = new Image();
  img.src = "/assets/bg-rank.png";
  img.onload = () => setBgLoaded(true);
}, []);

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
      .then(updated => {
        setDailyClicks(updated.dailyTasks.dailyTaps);
        setRewardCollected(updated.dailyTasks.rewardReceived);
        setWeeklyMavro(updated.weeklyMission.current);
        showTempNotice("✅ +5 000 мавродиков за ежедневное задание!");
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
  
      setWeeklyMavro(current); // ⬅️ обязательно обновить UI-прогресс
  
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
  
      // Всё ок — отправляем POST на выдачу награды
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
  
    } catch (err) {
      console.error("❌ Ошибка при проверке недельного прогресса:", err);
      setShowNotice("🚫 Ошибка подключения");
      setTimeout(() => setShowNotice(null), 4000);
    }
  };

const openVideoModal = () => {
  setShowVideoModal(true);
  setVideoEnded(false);
};

const closeVideoModal = () => {
  setShowVideoModal(false);
  setVideoEnded(false);
};

const handleGetAdBonus = () => {
  if (!telegramId || adsWatched >= 5) return;
  setIsLoading(true);

  fetch("https://mmmgo-backend.onrender.com/player", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId,
      adsWatched: adsWatched + 1,
      balanceBonus: 1000,
    }),
    keepalive: true,
  })
    .then(res => res.json())
    .then(updated => {
      setAdsWatched(updated.adsWatched);
      showTempNotice("✅ +1 000 мавродиков за просмотр видео!");
      closeVideoModal();
    })
    .catch(err => {
      showTempNotice("🚫 Ошибка при выдаче бонуса");
      closeVideoModal();
    })
    .finally(() => setIsLoading(false));
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
      .then(() => setIsSubscribed(true))
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
      <button
        className="task-button"
        disabled={adsWatched >= 5}
        onClick={openVideoModal}
      >
        🎁 Получить бонус
      </button>
    </div>

    {/* Модальное окно с видео */}
    {showVideoModal && (
      <div className="modal-overlay" onClick={closeVideoModal}>
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
          style={{ background: "rgba(30,30,30,0.94)" }}
        >
          <h3 style={{ color: "#ffe082" }}>
            Посмотри видео до конца для получения бонуса!
          </h3>
          <div className="video-frame" style={{ marginBottom: 20 }}>
            <video
              width="100%"
              height="180"
              controls
              onEnded={() => setVideoEnded(true)}
              style={{
                borderRadius: 12,
                maxWidth: 340,
                background: "#000",
                outline: "none",
              }}
            >
              <source src="/assets/ad-video.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
          <button
            className="task-button"
            disabled={!videoEnded || isLoading}
            onClick={handleGetAdBonus}
            style={{
              margin: "16px 0 0 0",
              opacity: videoEnded ? 1 : 0.7,
              background: videoEnded
                ? "linear-gradient(to bottom, #ffe259, #ffa751)"
                : "linear-gradient(to bottom, #e0e0e0, #ffa751)",
              color: videoEnded ? "#874900" : "#b0a080",
            }}
          >
            {videoEnded ? "✅ Получить 1000 мавродиков" : "⏳ Досмотри видео"}
          </button>
          <button
            style={{
              marginTop: 12,
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 24px",
            }}
            onClick={closeVideoModal}
          >
            Отмена
          </button>
        </div>
      </div>
    )}

    {/* Подписка на партнёра */}
    <div className="task-block">
      <h3>📢 Подпишись на наш новостной канал </h3>
      <p>Канал: <strong>@example_channel</strong></p>
      {isSubscribed
        ? <div className="task-complete">✅ Подписка подтверждена</div>
        : <button className="task-button" onClick={handleSubscribe}>📎 Я подписался</button>
      }
    </div>

    {/* Ежедневные задания */}
    <div className="task-block">
      <h3>🌀 Ежедневные задания</h3>
      <p>Натапай 5 000 мавродиков<br />Прогресс: <strong>{dailyClicks}/5000</strong></p>
      <button
        className="task-button"
        onClick={claimDailyReward}
        disabled={rewardCollected}
      >🎁 Забрать награду</button>
    </div>

    {/* Миссия недели */}
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