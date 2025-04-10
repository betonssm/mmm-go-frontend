
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // правильный путь к стилям

// Пример SR рейтинга
const srRating = 1200; // Пример SR рейтинга игрока

export default function PlayerRatingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(assets/bg-rating.png)`, // путь к фону
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px", // отступ сверху
        paddingBottom: "30px", // отступ снизу
      }}
    >
      {/* Обновлённый бар с SR рейтингом игрока */}
      <div style={{
        position: "relative", // внутри потока документа
        marginBottom: "20px", // отступ снизу
        background: "rgba(255, 215, 0, 0.7)",
        color: "#000",
        fontSize: "18px", // уменьшенный размер текста
        padding: "8px 15px", // уменьшенные отступы
        borderRadius: "12px",
        fontWeight: "bold",
        boxShadow: "0 0 10px #ffd700",
        zIndex: 10,
        textAlign: "center", // центрируем текст внутри блока
        maxWidth: "90%", // ограничиваем ширину блока
        margin: "0 auto", // выравнивание по центру
      }}>
        <h3>SR рейтинг игрока: {srRating}</h3>
        <p>Этот рейтинг зависит от активности и рефералов.</p>
      </div>

      {/* Заголовок страницы */}
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "8px" }}>
        📊 SR Рейтинг Игрока
      </h2>

      <p style={{ marginBottom: "8px", color: "#ffe082" }}>
        Твой SR рейтинг: <strong>{srRating}</strong>
      </p>

      <p style={{ color: "#ffe082" }}>
        Рейтинг зависит от активности, рефералов и других факторов.
      </p>

      {/* Кнопка назад */}
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
          marginRight: "auto", // выравнивание кнопки по центру
        }}
      >
        🔙 Назад
      </button>
    </div>
  );
}