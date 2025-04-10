
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // правильный путь к стилям

// Пример баланса и уровня
const balance = 2500000; // Пример баланса
const level = Math.floor(balance / 1000000); // Ранг на основе баланса
const progress = (balance % 1000000) / 1000000; // Прогресс к следующему уровню

// Пример общего пула
const totalPool = 5000000; // Это пример общей суммы пула, её можно менять в зависимости от логики игры

export default function RankPage() {
  const navigate = useNavigate();

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rank.png)`, // путь к фону
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Блок с общей суммой пула */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255, 215, 0, 0.7)",
        color: "#000",
        fontSize: "20px",
        padding: "10px 20px",
        borderRadius: "12px",
        fontWeight: "bold",
        boxShadow: "0 0 10px #ffd700",
        zIndex: 10,
      }}>
        <h3>Общий пул на этот месяц: {totalPool} мавродиков</h3>
        <p>Этот пул разделяется среди топ 10% инвесторов</p>
      </div>

      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000" }}>
        🏅 Твой Инвесторский Ранг
      </h2>

      <p style={{ marginBottom: "12px", color: "#ffe082" }}>
        Ты уже инвестор уровня <strong>{level}</strong>!<br />
        А может, почти...
      </p>

      <p style={{ color: "#ffe082" }}>
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
        <h3 style={{ color: "#ffe082" }}>📊 Ключевые принципы:</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li><strong style={{ color: "#ffe082" }}>1. Каждый пул делится по той же формуле, как и дивиденды:</strong> 30% донат, 60% рефералы, 10% активность.</li>
          <li><strong style={{ color: "#ffe082" }}>2. Чем выше SR и вклад, тем больше токенов.</strong></li>
          <li><strong style={{ color: "#ffe082" }}>3. Нельзя получить токены без активности.</strong></li>
          <li><strong style={{ color: "#ffe082" }}>4. Чем позже пришёл — тем меньше пул, но всё ещё можно заработать.</strong></li>
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