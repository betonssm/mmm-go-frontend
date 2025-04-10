
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // Убедитесь, что стили правильные

export default function RulesPage() {
  const navigate = useNavigate();

  return (
    <div
      className="rules-page-container"  // Используем специальный класс для контейнера
      style={{
        backgroundImage: `url(/assets/bg-rules.png)`,  // фон для страницы
        backgroundSize: "cover",  // Фон не будет растягиваться
        backgroundPosition: "center",  // Центрируем фон
        backgroundRepeat: "no-repeat",  // Не повторяем фон
        minHeight: "100vh",  // Страница должна занимать всю высоту экрана
        display: "flex",  // Используем flexbox для вертикального распределения
        flexDirection: "column",  // Вертикальное расположение
        paddingTop: "30px",  // отступ сверху
        paddingBottom: "30px",  // отступ снизу
        padding: "0 20px",  // Добавим отступы по бокам
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "20px" }}>
        📜 Правила игры MMM Go
      </h2>

      {/* Сжато изложенные правила */}
      <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082" }}>Основные моменты:</h3>
        <ul style={{ color: "#ffe082", listStyleType: "disc", paddingLeft: "20px" }}>
          <li><strong>Цель игры</strong>: стать инвестором и получать долю от фонда (реклама и донаты).</li>
          <li><strong>Добыча мавродиков</strong>: до 10,000 в сутки для бесплатных игроков. Бонусы за рефералов.</li>
          <li><strong>Подписка</strong>: для участия в распределении доходов нужно подписаться за 10$.</li>
          <li><strong>Рейтинг SR</strong>: важен для получения доли в фонде (активность, рефералы).</li>
          <li><strong>Распределение фонда</strong>: топ 10% инвесторов делят фонд. Топ-1% — 30%, топ-2-5% — 35%, топ-6-10% — 35%.</li>
        </ul>
      </div>

      <p style={{ color: "#ffe082", textAlign: "center" }}>
        Для более подробной информации, пожалуйста, ознакомьтесь с полными правилами на <a href="https://example.com/rules" style={{ color: "#ffe082" }}>сайте</a>.
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
          marginRight: "auto", // выравнивание по центру
        }}
      >
        Принять
      </button>
    </div>
  );
}