
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";
import "../assets/bg-rank.png"; // Фон

// Пример баланса и уровня
const balance = 2500000; // Пример баланса
const level = Math.floor(balance / 1000000); // Ранг на основе баланса
const progress = (balance % 1000000) / 1000000; // Прогресс к следующему уровню

export default function RankPage() {
  const navigate = useNavigate();

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rank.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000" }}>
        🏅 Твой Инвесторский Ранг
      </h2>

      <p style={{ marginBottom: "12px" }}>
        Ты уже инвестор уровня <strong>{level}</strong>!<br />
        А может, почти...
      </p>

      <p>
        Чем больше у тебя мавродиков, тем выше твой статус.
        <br />
        Следующий ранг откроется при новом уровне 💸
      </p>

      {/* Прогресс-бар */}
      <div style={{ width: "100%", backgroundColor: "#ddd", borderRadius: "10px", overflow: "hidden" }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: "10px",
            background: "linear-gradient(to right, #ffe259, #ffa751)",
            borderRadius: "10px",
          }}
        ></div>
      </div>

      {/* Ключевые принципы */}
      <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255, 255, 255, 0.8)", borderRadius: "12px" }}>
        <h3>📊 Ключевые принципы:</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li><strong>1. Каждый пул делится по той же формуле, как и дивиденды:</strong> 30% донат, 600% рефералы, 10% активность.</li>
          <li><strong>2. Чем выше SR и вклад, тем больше токенов.</strong></li>
          <li><strong>3. Нельзя получить токены без активности.</strong></li>
          <li><strong>4. Чем позже пришёл — тем меньше пул, но всё ещё можно заработать.</strong></li>
        </ul>
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
        }}
      >
        🔙 Назад
      </button>
    </div>
  );
}