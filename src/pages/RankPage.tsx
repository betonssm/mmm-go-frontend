
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // исправь путь, если нужно

export default function RankPage() {
  const navigate = useNavigate();

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rank.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000" }}>
        🏅 Твой Инвесторский Ранг
      </h2>
      <p style={{ marginBottom: "12px" }}>
        Ты уже инвестор уровня <strong>легенда</strong>!<br />
        А может, почти...
      </p>
      <p>
        Чем больше у тебя мавродиков, тем выше твой статус.
        <br />
        Следующий ранг откроется при новом уровне 💸
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
        }}
      >
        🔙 Назад
      </button>
    </div>
  );
}