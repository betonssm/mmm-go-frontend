
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function PlayerRatingPage() {
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fund, setFund] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const tg = (window as any).Telegram?.WebApp;
  const telegramId = tg?.initDataUnsafe?.user?.id;

  // Получение данных игрока
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (user) {
      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPlayerData(data);
        })
        .catch((err) => console.error("Ошибка загрузки данных игрока:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    fetch(`https://mmmgo-backend.onrender.com/fund`)
      .then(res => res.json())
      .then(data => setFund(data.total))
      .catch(err => console.error("Ошибка загрузки пула:", err));
    const img = new Image();
    img.src = "/assets/bg-rating.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  // Получаем leaderboard (ТОЛЬКО когда есть игрок)
  useEffect(() => {
    if (!playerData) return;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    fetch(`https://mmmgo-backend.onrender.com/player/sr-leaderboard?month=${month}`)
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(() => setLeaderboard([]));
  }, [playerData]);

  if (!bgLoaded || loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  if (!playerData) {
    return <div className="error">Не удалось загрузить данные игрока.</div>;
  }

  const { srRating, isInvestor, premiumExpires } = playerData;
  const now = new Date();
  const expires = premiumExpires ? new Date(premiumExpires) : null;
  const isActive = isInvestor && expires && now < expires;

  // Находим позицию игрока в leaderboard
const playerPosition = useMemo(() => {
  if (!leaderboard || !Array.isArray(leaderboard)) return null;
  return leaderboard.find(entry => String(entry.telegramId) === String(telegramId));
}, [leaderboard, telegramId]);
  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rating.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px",
        paddingBottom: "30px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
 position: "relative",
  marginBottom: "24px",
  background: "linear-gradient(135deg, #fff8dc, #ffe082)",
  color: "#000",
  padding: "20px",
  borderRadius: "16px",
  fontWeight: "bold",
  boxShadow: "0 0 20px rgba(255, 215, 0, 0.7)",
  textAlign: "center",
  maxWidth: "92%",
  margin: "0 auto",
  border: "2px solid #c8b900",
  fontFamily: "'Orbitron', sans-serif",
        }}
      >
        {isActive ? (
          <>
            <h3 style={{
  fontSize: "22px",
  color: "#d4af37",
  textShadow: "1px 1px 4px #000",
  marginBottom: "10px"
}}>
  SR рейтинг игрока: {srRating}
</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#333" }}>
  Подписка активна до: <b style={{ color: "#4caf50" }}>{expires?.toLocaleDateString()}</b><br />
  <small style={{ color: "#555" }}>
    Подписка действует до конца следующего месяца независимо от даты покупки
  </small>
</p>
 {playerPosition && (
      <div style={{
        margin: "14px 0 0 0",
        fontWeight: "bold",
        color: "#009688",
        fontSize: "17px",
      }}>
        Ваша позиция в рейтинге: <b>#{playerPosition.place}</b> из <b>{leaderboard.length}</b>
        <br />
        {playerPosition.place <= Math.ceil(leaderboard.length * 0.1) && (
          <span style={{ color: "#ff5722", fontWeight: 700 }}>🔥 Топ-10%!</span>
        )}
      </div>
    )}
          </>
          ) : (
          <>
            <h3>SR рейтинг недоступен</h3>
            <p>Подписка не активна или истекла.</p>
          </>
        )}
                  <p style={{ marginTop: "12px", color: "#2e7d32", fontSize: "16px" }}>
  🪙 Баланс MMMGO токенов: <strong>{playerData.mmmgoTokenBalance ?? 0}</strong>
</p>
<p style={{ margin: "10px 0 0 0", color: "#2e7d32", fontSize: "16px" }}>
  Ваш ID: <strong style={{ color: "#222" }}>{telegramId}</strong>
</p>
      </div>
      <div style={{
  margin: "30px auto",
  padding: "20px",
  background: "rgba(0, 0, 0, 0.6)",
  borderRadius: "16px",
  textAlign: "center",
  color: "#fff",
  maxWidth: "90%",
  boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)"
}}>
  <h2 style={{
    marginBottom: "10px",
    fontSize: "20px",
    color: "#ffe082",
    textShadow: "1px 1px 3px #000"
  }}>
    💰 Общий игровой бонус:
  </h2>
  {fund !== null ? (
    <div style={{
      fontSize: "32px",
      fontWeight: "bold",
      color: "#ffd700",
      textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
      background: "linear-gradient(90deg, #fff176, #ffd54f, #ffb300)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {fund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  ) : (
    <span>Загрузка…</span>
  )}
</div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "12px",
          background: "linear-gradient(to bottom, #ffe259, #ffa751)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px #ffca28",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        🔙 Назад
      </button>
      </div>
)}
