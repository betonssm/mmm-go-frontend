
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function PlayerRatingPage() {
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

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

    const img = new Image();
    img.src = "/assets/bg-rating.png";
    img.onload = () => setBgLoaded(true);
  }, []);

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
          marginBottom: "20px",
          background: "rgba(255, 215, 0, 0.7)",
          color: "#000",
          fontSize: "18px",
          padding: "8px 15px",
          borderRadius: "12px",
          fontWeight: "bold",
          boxShadow: "0 0 10px #ffd700",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        {isActive ? (
          <>
            <h3>SR рейтинг игрока: {srRating}</h3>
            <p>Подписка активна до: {expires?.toLocaleDateString()}</p>
          </>
        ) : (
          <>
            <h3>SR рейтинг недоступен</h3>
            <p>Подписка не активна или истекла.</p>
          </>
        )}
      </div>

      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "8px" }}>
        📊 SR Рейтинг Игрока
      </h2>

      {isActive ? (
        <p style={{ marginBottom: "8px", color: "#ffe082" }}>
          Твой SR рейтинг: <strong>{srRating}</strong>
        </p>
      ) : (
        <p style={{ marginBottom: "8px", color: "#ff8c00" }}>
          Приобретите или продлите премиум, чтобы начать накапливать SR очки.
        </p>
      )}

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
  );
}