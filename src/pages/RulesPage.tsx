
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // Убедитесь, что стили подключены правильно

export default function RulesPage() {
  const navigate = useNavigate();

  return (
    <div
      className="rules-page-container"  // Этот класс локально определяет стили для этой страницы
      style={{
        backgroundImage: `url(/assets/bg-rules.png)`,  // Проверьте, что bg-rules.png лежит в папке public/assets/
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh", // Страница занимает всю высоту экрана
        display: "flex", // Flexbox для вертикального расположения
        flexDirection: "column",
        paddingTop: "30px",
        paddingBottom: "30px",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          color: "#ffe082",
          textShadow: "2px 2px 6px #000",
          marginBottom: "20px",
        }}
      >
        📜 Правила игры MMM Go
      </h2>

      {/* Сжатое изложение основных правил */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ color: "#ffe082" }}>Основные моменты:</h3>
        <ul
          style={{
            color: "#ffe082",
            listStyleType: "disc",
            paddingLeft: "20px",
          }}
        >
          <li>
            <strong>Цель игры</strong>: стать инвестором и получать долю от фонда (реклама и донаты).
          </li>
          <li>
            <strong>Добыча мавродиков</strong>: до 10,000 в сутки для бесплатных игроков, бонусы за рефералов.
          </li>
          <li>
            <strong>Подписка</strong>: для участия в распределении доходов нужно подписаться за 10$.
          </li>
          <li>
            <strong>Рейтинг SR</strong>: важен для получения доли в фонде (активность, рефералы).
          </li>
          <li>
            <strong>Распределение фонда</strong>: топ 10% инвесторов делят фонд (30% для топ-1%, 35% для топ-2–5% и 35% для топ-6–10%).
          </li>
        </ul>
      </div>

      <p style={{ color: "#ffe082", textAlign: "center", marginBottom: "20px" }}>
        Для подробных правил посетите страницу с полными правилами:{" "}
        <a href="https://example.com/rules" style={{ color: "#ffe082", textDecoration: "underline" }}>
          Полные правила
        </a>
      </p>

      {/* Кнопка "Принять" */}
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
        Принять
      </button>
    </div>
  );
}