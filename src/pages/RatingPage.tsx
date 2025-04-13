
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // правильный путь к стилям

export default function PlayerRatingPage() {
  const navigate = useNavigate();
  const [srRating, setSrRating] = useState(0);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user) {
      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setSrRating(data.srRating || 0);
        })
        .catch((err) => console.error("Ошибка загрузки SR рейтинга:", err));
    }
  }, []);

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(assets/bg-rating.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px",
        paddingBottom: "30px",
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
        <h3>SR рейтинг игрока: {srRating}</h3>
        <p>Этот рейтинг зависит от активности и рефералов.</p>
      </div>

      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "8px" }}>
        📊 SR Рейтинг Игрока
      </h2>

      <p style={{ marginBottom: "8px", color: "#ffe082" }}>
        Твой SR рейтинг: <strong>{srRating}</strong>
      </p>

      <p style={{ color: "#ffe082" }}>
        Рейтинг зависит от активности, рефералов и других факторов.
      </p>

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